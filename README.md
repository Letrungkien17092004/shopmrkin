# Shopmrkin

![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge)
![Clean Architecture](https://img.shields.io/badge/Clean%20Architecture-00C7B7?style=for-the-badge)

Shopmrkin is a web shop platform for selling items, built with a focus on clean architecture and modern web technologies.

## Project Structure

- **client/**: Front-end code (to be implemented)
- **server/**: Back-end code (Express, TypeScript, Prisma ORM)
  - `adapter/`: Handles communication between external interfaces and the core logic.
  - `core/`: Contains business logic and domain entities.
  - `framework/`: Framework-specific code (Express, etc.).
  - `infras/`: Infrastructure code (database, external services).

## Tech Stack

- **Express.js**: Web server framework
- **TypeScript**: Type-safe JavaScript
- **Prisma ORM**: Database ORM for Node.js

## Features

- User account management and authentication
- Product management
- Order and sales management
- Discount code management
- Online payment integration

## Getting Started

1. Clone the repository.
2. Install dependencies in the `server/` directory:
   ```sh
   cd server
   npm install