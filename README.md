# Shopmrkin

![Clean Architecture](https://img.shields.io/badge/Clean%20Architecture-00C7B7?style=for-the-badge)
![Typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![ExpressJS](https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![PrismaORM](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![REST API](https://img.shields.io/badge/REST%20API-0EA5A4?style=for-the-badge)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)
![OAuth2](https://img.shields.io/badge/OAuth2-316BFF?style=for-the-badge&logo=oauth&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)
![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JS](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)


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
