# Shopmrkin

![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge)
![Clean Architecture](https://img.shields.io/badge/Clean%20Architecture-00C7B7?style=for-the-badge)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge)
![Webpack](https://img.shields.io/badge/Webpack-8DD6F9?style=for-the-badge)
![Babel](https://img.shields.io/badge/Babel-F9DC3E?style=for-the-badge)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql)

Shopmrkin is a web shop for selling items, built with a focus on clean architecture and modern web technologies.

## Features

- User account management and authentication
- Product management
- Order and sales management
- Online payment with VN Pay

## Tech Stack

- **Express.js**: Web server framework
- **TypeScript**: Type-safe JavaScript
- **Prisma ORM**: Database ORM for Node.js
- **React.js**: Front-end framework
- **Babel**: compiler for TSX
- **Webpack**: source code packaging

## Project Structure

- **client/**: Front-end
- **server/**: Back-end
  - `__test__/`: perform unit test using jest.js Framework
  - `adapter/`: Handles communication between external interfaces and the core logic.
  - `config/`: set environment variables.
  - `core/`: Contains business logic and domain entities.
  - `expressApp/`: Express.js framework.
  - `repositorys`: Implement repository interfaces, uses service from `service`.
  - `services/`: Communicate with external service such as postgreSQL, VN Pay.
  - `types/`: Expand types (Expand Express.Request,...)
  - `app.js`: Entry point
