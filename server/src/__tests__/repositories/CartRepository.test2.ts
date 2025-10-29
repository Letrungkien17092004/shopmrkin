// // Import Jest functions explicitly
// import { describe, it, expect, beforeEach, jest } from '@jest/globals'
// import { PrismaClient } from "@prisma/client"
// import CartRepository from "../../repositories/CartRepository.js"
// import { REPO_ERROR, REPO_ERROR_CODE } from "../../core/applications/interfaces/repositories/errors.js"
// import Cart from "../../core/entities/Cart.js"

// // Mock PrismaClient
// jest.mock("@prisma/client", () => {
//     return {
//         PrismaClient: jest.fn().mockImplementation(() => ({
//             carts: {
//                 create: jest.fn(),
//                 findUnique: jest.fn(),
//                 delete: jest.fn()
//             },
//             cartItems: {
//                 create: jest.fn(),
//                 deleteMany: jest.fn()
//             }
//         }))
//     }
// })
