
# 🛒 Ecommerce Backend API

A fully functional backend service for an e-commerce platform, built with **NestJS**, **TypeORM**, **PostgreSQL**, and **Docker**, featuring authentication, product management, order processing, role-based access control, and automated CI/CD deployment to **AWS ECS Fargate**.

---

## 🚀 Features

- 🔐 **Authentication** – JWT login, registration, and role-based guards
- 📦 **Product Management** – Admins can create, update, delete products
- 🛍 **Order Processing** – Users can place orders with total price calculation
- 🧑‍💼 **Role-based Authorization** – Protect admin routes with custom guards
- 🧪 **Unit Testing** – ≥ 70% coverage using Jest
- 📦 **Dockerized Development** – `docker-compose` one-click startup
- ⚙️ **CI/CD** – GitHub Actions for test + deploy to AWS ECS
- ☁️ **AWS Infra** – ECS Fargate, ALB, RDS, ECR, Secrets Manager via CloudFormation

---

## 📁 Project Structure

```
src/
├── auth/        # JWT strategy, guards, decorators
├── user/        # Registration, login
├── product/     # CRUD for products
├── order/       # Create & fetch orders
├── common/      # Shared utils and decorators
```

---

## 🧪 Testing

- Run tests: `npm run test`
- Run coverage: `npm run test:cov`
- ✅ **Current Coverage:**  
  `Statements: 70.67%`  
  `Lines: 71.62%`  
  `Functions: 67.3%`  

---

## 🧱 Local Development

### 🐳 Docker Setup

```bash
docker-compose up --build
```

Includes:
- `nestjs backend`
- `PostgreSQL database`

### 🌱 Environment Variables

Create `.env` based on `.env.example`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=ecommerce
JWT_SECRET=your_jwt_secret
```

---

## 📦 API Endpoints

| Method | Endpoint             | Description               | Auth         |
|--------|----------------------|---------------------------|--------------|
| POST   | `/users/register`    | Register new user         | ❌ Public     |
| POST   | `/users/login`       | Login user                | ❌ Public     |
| POST   | `/users/register-admin` | Create admin           | ❌ Public     |
| POST   | `/products/create`   | Create product            | ✅ Admin only |
| PUT    | `/products/:id`      | Update product            | ✅ Admin only |
| DELETE | `/products/:id`      | Delete product            | ✅ Admin only |
| GET    | `/products/all`      | View all products         | ❌ Public     |
| POST   | `/orders`            | Create order              | ✅ User only  |
| GET    | `/orders/myorder`    | Get user’s orders         | ✅ User only  |
| GET    | `/orders`            | View all orders           | ✅ Admin only |

---

## ☁️ AWS Deployment

### ECS Architecture

- **Service:** ECS Fargate
- **Container Registry:** Amazon ECR
- **Database:** Amazon RDS PostgreSQL
- **Load Balancer:** Application Load Balancer (ALB)
- **Secrets:** Stored in AWS Secrets Manager

### ALB Public URL

```
http://ecs-fa-LoadB-oXqKYRTKt796-1608226564.us-east-2.elb.amazonaws.com
```

### GitHub Actions CI/CD

- Triggers on `push` to `main`
- Runs `test:cov`
- Builds and pushes Docker image to ECR
- Deploys to ECS

Workflow file: `.github/workflows/deploy.yml`

---

## 📜 Infrastructure as Code

All infrastructure is provisioned via **CloudFormation**:

- ✅ VPC, subnets, security groups
- ✅ RDS instance
- ✅ ECS cluster, service
- ✅ ECR repo
- ✅ ALB & listeners
- ✅ IAM roles

Templates stored in `infra/cloudformation/`

---

## ✅ Deliverables

- [x] `Dockerfile` + `docker-compose.yml`
- [x] `.env`
- [x] `CI/CD workflow` via GitHub Actions
- [x] `CloudFormation templates`
- [x] Test coverage ≥ 70%
- [x] Public ECS/ALB URL
- [x] Completed README

---

## 🧑‍💻 Author

Built by [Hao Shi] – May 2025
