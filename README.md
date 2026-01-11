# Financial dashboard application

**Fullstack application providing management and analytics of transactions**

## Features
- User authentication (login/register/logout)
- Dashboard with key metrics (income, expenses, net worth)
- Transaction management (add, edit, delete)
- Analytics charts (1 year trends, category breakdown)
- User profile settings
- Sample data for demo

## Tech Stack
- **Frontend:** Angular
- **Backend:** Spring Boot
- **Database:** PostgreSQL (Docker)

## Project Structure
**frontend**
- Angular application
  
**backend**
- Spring application
- (Postgres database) docker-compose.yaml

## Demo login
- Email: john@example.com
- Username John Brown 
- Password: password

## Endpoints:
- Post /auth/register
- Post /auth/login
- Get /transactions/userTransactions/{userId}
- Post /transactions/addTransaction
- Post /transactions/editTransaction
- Delete /transactions/deleteTransaction/{id}
- Get /transactions/getIncome/{userId}
- Get /transactions/getExpenses/{userId}
- Post /profile/changePassword
- Post /profile/changeData
