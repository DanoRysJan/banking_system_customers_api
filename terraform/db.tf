resource "aws_db_instance" "postgres" {
  identifier        = "banking-customers-db"
  engine           = "postgres"
  engine_version   = "14.17"
  instance_class   = "db.t3.micro"
  allocated_storage = 20
  storage_type     = "gp2"

  username = jsondecode(data.aws_secretsmanager_secret_version.db_secrets.secret_string)["DB_USERNAME"]
  password = jsondecode(data.aws_secretsmanager_secret_version.db_secrets.secret_string)["DB_PASSWORD"]

  publicly_accessible = false
  skip_final_snapshot = true
  db_subnet_group_name = aws_db_subnet_group.default.name

  vpc_security_group_ids = [aws_security_group.rds_sg.id]
}

data "aws_secretsmanager_secret_version" "db_secrets" {
  secret_id = "banking-customers-secrets"
}

resource "aws_db_subnet_group" "default" {
  name       = "rds-subnet-group"
  subnet_ids = [aws_subnet.sn1.id, aws_subnet.sn2.id, aws_subnet.sn3.id]

  tags = {
    Name = "RDS subnet group"
  }
}

resource "aws_security_group" "rds_sg" {
  name        = "rds-security-group"
  description = "Allow database access"
  vpc_id      = aws_vpc.vpc.id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
  }
}
