# NestJS Project with CQRS and Hexagonal Architecture

## Description
This project is a NestJS application that follows the hexagonal architecture and CQRS pattern to ensure a modular, scalable, and maintainable structure. It implements best development practices and utilizes various technologies to ensure robustness and efficient deployment.

### Technologies Used
- **Database:** PostgreSQL with TypeORM
- **Data Modeling:** Visual Paradigm
- **Infrastructure as Code:** Terraform
- **CI/CD:** GitHub Actions
- **Cloud Deployment:** AWS ECS Fargate Cluster and Repository, AWS Secrets Manager, AWS RDS
- **Networking and Security:** AWS VPC

## Table of Contents
- [NestJS Project with CQRS and Hexagonal Architecture](#nestjs-project-with-cqrs-and-hexagonal-architecture)
  - [Description](#description)
    - [Technologies Used](#technologies-used)
  - [Table of Contents](#table-of-contents)
  - [Environment Variables Configuration](#environment-variables-configuration)
  - [Database Migration](#database-migration)
  - [Project Execution](#project-execution)
  - [Swagger Documentation](#swagger-documentation)
  - [Data Modeling](#data-modeling)
  - [Architecture](#architecture)
  - [Authentication and Token](#authentication-and-token)
  - [Exception Handling](#exception-handling)
  - [Postman Collection](#postman-collection)
  - [Testing](#testing)
  - [Coverage Explanation](#coverage-explanation)
  - [Production Deployment with Terraform](#production-deployment-with-terraform)
  - [CI/CD](#cicd)

---

## Environment Variables Configuration
Before running the project, you need to configure the environment variables. Copy the example file `.env.example` and rename it to `.env`, then fill in the required values.

```sh
cp .env.example .env
```

Example `.env` file:
```ini
# PostgreSQL Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=test
DB_PASSWORD=test
DB_NAME=test
DB_SYNCHRONIZE=false

# JWT TOKEN
JWT_SECRET=test
JWT_EXPIRATION=3600

# HTTP SERVER
NODE_ENV=development
PORT=3000
```

## Database Migration
Create the database and execute the migrations:

```sh
npm run migration:run
```

To revert a migration:

```sh
npm run migration:revert
```

## Project Execution
To run the project in development mode:

```sh
npm run start:dev
```

For production mode:

```sh
npm run build && npm run start:prod
```

## Swagger Documentation
API documentation is available at:

```
http://localhost:3000/api-docs
```

## Data Modeling
The first step is data modeling to understand the database structure.

Below is the data model:

![Data Modeling](https://res.cloudinary.com/dogxwhwar/image/upload/v1740785242/Screenshot_2025-02-28_at_5.27.00_p.m._l0mfxy.png)

## Architecture
This is the project architecture:

![Architecture](https://res.cloudinary.com/dogxwhwar/image/upload/v1740785242/Screenshot_2025-02-28_at_5.27.00_p.m._l0mfxy.png)

## Authentication and Token
This project uses JWT-based authentication. Ensure that the secret key is configured in the environment variables.

## Exception Handling
The project centrally handles exceptions using `ExceptionFilters`.

Example:
```ts
import { AppError } from './app-error';

export class EntityNotFoundError extends AppError {
  constructor(id: string) {
    super(`Entity with ID ${id} not found.`);
  }
}
```

## Postman Collection
You can access the Postman collection at the following link:

[Postman Workspace](https://liberet.postman.co/workspace/096705f3-4ba0-40e9-86f2-23e85a31ca0c)

## Testing
Run unit and integration tests with:

```sh
npm run test
```

Run tests in watch mode:

```sh
npm run test:watch
```

## Coverage Explanation
To generate the test coverage report:

```sh
npm run test:cov
```

The report will be generated in the `coverage/` folder and can be viewed in `index.html`.

## Production Deployment with Terraform
To deploy on AWS ECS Fargate using Terraform:

```sh
cd terraform
terraform init
terraform plan
terraform apply
```

Confirm with `yes` to start the deployment on AWS.

## CI/CD
We use GitHub Actions for CI/CD. The configuration file is located at `.github/workflows/aws.yml` and runs on every push to `main`.

Secrets in GitHub:
```
AWS_ACCESS_KEY_ID
AWS_REGION
AWS_SECRET_ACCESS_KEY
ECR_REGISTRY
ECR_REPOSITORY
```

Secrets in AWS Secrets Manager:
```json
{
  "DB_HOST": "",
  "DB_PORT": "",
  "DB_USERNAME": "",
  "DB_PASSWORD": "",
  "DB_NAME": "",
  "DB_SYNCHRONIZE": "",
  "JWT_SECRET": "",
  "JWT_EXPIRATION": "",
  "NODE_ENV": "",
  "PORT": ""
}
```
These variables must match those configured in the `.env` file.

