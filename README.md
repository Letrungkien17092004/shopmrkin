# Shopmrkin

![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge)
![Clean Architecture](https://img.shields.io/badge/Clean%20Architecture-00C7B7?style=for-the-badge)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite)
![Redux](https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=redux)
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
- **PostgreSQL**: Database
- **React.js**: Front-end framework
- **Babel**: compiler for TSX
- **Vite**: source code packaging

## Project Structure

- **client/**: Front-end
  - `components/`: React components
  - `config/`: set enviroment variables
  - `contexts/`: App context
  - `entities/`: types
  - `hooks/`: React hook, Redux hook
  - `pages/`: pages components
  - `routers/`: config router
  - `service/`: communicate with external service such as back-end API, browser API
  - `store/`: Redux store
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
