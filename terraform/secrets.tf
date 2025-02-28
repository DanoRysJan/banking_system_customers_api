resource "aws_secretsmanager_secret" "banking_customers_secrets" {
  name        = "banking-customers-secrets"
  description = "Secrets for Banking Customers API"
}
