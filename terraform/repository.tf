resource "aws_ecr_repository" "banking-customers-api-repository" {
  name                 = "banking-customers-api-repository"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

output "ecr_repository_uri" {
  value = aws_ecr_repository.banking-customers-api-repository.repository_url
  description = "ECR Repository URI"
}
