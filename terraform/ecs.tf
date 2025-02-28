resource "aws_ecs_cluster" "ecs" {
  name = "banking-customers-api-cluster"
}

resource "aws_ecs_service" "service" {
  name                               = "banking-customers-api-service"
  cluster                            = aws_ecs_cluster.ecs.arn
  launch_type                        = "FARGATE"
  enable_execute_command             = true
  deployment_maximum_percent         = 200
  deployment_minimum_healthy_percent = 100
  desired_count                      = 1
  task_definition                    = aws_ecs_task_definition.td.arn

  network_configuration {
    assign_public_ip = false
    security_groups  = [aws_security_group.sg.id]
    subnets          = [aws_subnet.sn1.id, aws_subnet.sn2.id, aws_subnet.sn3.id]
  }
}

resource "aws_ecs_task_definition" "td" {
  family                   = "app"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  network_mode             = "awsvpc"
  task_role_arn            = aws_iam_role.ecs_task_execution_role.arn
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    {
      name         = "app"
      image        = aws_ecr_repository.banking-customers-api-repository.repository_url
      cpu          = 256
      memory       = 512
      essential    = true
      environment = [
        { name = "NODE_ENV", value = "production" }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.ecs_logs.name
          awslogs-region        = "us-east-2"
          awslogs-stream-prefix = "ecs"
        }
      }
      portMappings = [
        {
          containerPort = 80
          hostPort      = 80
        }
      ]
      secrets = [
        { name = "DB_HOST", valueFrom = aws_secretsmanager_secret.banking_customers_secrets.arn },
        { name = "DB_PORT", valueFrom = aws_secretsmanager_secret.banking_customers_secrets.arn },
        { name = "DB_USERNAME", valueFrom = aws_secretsmanager_secret.banking_customers_secrets.arn },
        { name = "DB_PASSWORD", valueFrom = aws_secretsmanager_secret.banking_customers_secrets.arn },
        { name = "DB_NAME", valueFrom = aws_secretsmanager_secret.banking_customers_secrets.arn },
        { name = "JWT_SECRET", valueFrom = aws_secretsmanager_secret.banking_customers_secrets.arn }
      ]
    }
  ])
}

resource "aws_cloudwatch_log_group" "ecs_logs" {
  name              = "/ecs/banking-api"
  retention_in_days = 7
}
