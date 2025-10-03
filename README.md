# Simple Mailer API

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

A RESTful API for managing messages and users, built with NestJS, TypeORM, PostgreSQL, and JWT authentication.

## About

This project was developed as part of the **NestJS Complete Course: REST API, TypeORM, JWT and more** on Udemy. The course covers comprehensive backend development with modern technologies and best practices.

**Course Link:** [NestJS - Curso Completo: REST API, TypeORM, JWT e mais](https://www.udemy.com/course/nestjs-curso-completo-rest-api-typeorm-jwt-e-mais/)

## Features

- **User Management**: Complete CRUD operations for users
- **Message System**: Send, receive, and manage messages between users
- **JWT Authentication**: Secure authentication with access and refresh tokens
- **Role-Based Authorization**: Protected routes with custom guards
- **Password Hashing**: Secure password storage using bcrypt
- **File Upload**: Profile picture upload functionality
- **Database Relations**: Proper TypeORM entity relationships
- **Input Validation**: Request validation with class-validator
- **Custom Pipes**: Parameter validation and transformation
- **Interceptors**: Response formatting and error handling
- **Environment Configuration**: Centralized configuration management
- **Comprehensive Testing**: Unit tests for services and controllers
- **Pagination**: Efficient data pagination with query parameters

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Validation**: class-validator, class-transformer
- **Testing**: Jest
- **Documentation**: REST Client (.rest files)
- **Environment**: Docker (PostgreSQL container)

## API Endpoints

### Authentication

- `POST /auth` - User login
- `POST /auth/refresh` - Refresh tokens

### Users

- `GET /users` - List all users (paginated)
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PATCH /users/:id` - Update user (authenticated)
- `DELETE /users/:id` - Delete user (authenticated)
- `POST /users/upload` - Upload profile picture (authenticated)

### Messages

- `GET /message` - List all messages (paginated)
- `GET /message/:id` - Get message by ID
- `POST /message` - Create new message (authenticated)
- `PATCH /message/:id` - Update message (authenticated)
- `DELETE /message/:id` - Delete message (authenticated)

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Pettecco/simple-mailer-api.git
   cd simple-mailer-api
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   cp .env.example .env
   ```

   Configure your environment variables in `.env` file.

4. **Database Setup (Docker)**

   ```bash
   docker run --name postgres \
     -e POSTGRES_PASSWORD=123456 \
     -e POSTGRES_DB=postgres \
     -p 5432:5432 \
     -d postgres
   ```

5. **Run the application**

   ```bash
   # Development
   npm run start:dev

   # Production
   npm run build
   npm run start:prod
   ```

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run test coverage
npm run test:cov
```

## Project Structure

```
src/
├── auth/                   # Authentication module
│   ├── guards/            # JWT guards
│   ├── hashing/           # Password hashing service
│   └── config/            # JWT configuration
├── users/                 # Users module
│   ├── dto/               # Data Transfer Objects
│   ├── entities/          # TypeORM entities
│   └── *.spec.ts         # Unit tests
├── message/               # Messages module
│   ├── dto/               # Data Transfer Objects
│   ├── entities/          # TypeORM entities
│   └── *.spec.ts         # Unit tests
├── common/                # Shared components
│   ├── dto/               # Common DTOs
│   ├── pipes/             # Custom pipes
│   ├── interceptors/      # Custom interceptors
│   └── filters/           # Exception filters
└── global-config/         # Global configuration
```

## Key Learning Topics

This project demonstrates:

- **NestJS Architecture**: Modules, Controllers, Services, and Dependency Injection
- **TypeORM**: Database modeling, relations, and migrations
- **Authentication & Authorization**: JWT implementation with guards
- **Security**: Password hashing, input validation, and request sanitization
- **Testing**: Unit testing with Jest, mocking, and test coverage
- **Configuration Management**: Environment variables and validation
- **Custom Decorators**: Parameter decorators and guards
- **Error Handling**: Exception filters and custom exceptions
- **File Upload**: Multer integration for file handling
- **Database Design**: Proper entity relationships and constraints

## License

This project is for educational purposes as part of the Udemy course curriculum.

---
