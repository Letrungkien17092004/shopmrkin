// // Import Jest functions explicitly - QUAN TRỌNG!
// import { describe, it, expect, beforeEach, jest } from '@jest/globals'
// import type { Mock } from 'jest-mock'
// import { Request, Response } from "express"
// import CartController from "../../../adapter/controllers/CartController.js"
// import ICartUsecase from "../../../core/applications/interfaces/usecases/ICartUsecase.js"
// import { USECASE_ERROR, USECASE_ERROR_CODE } from "../../../core/applications/interfaces/usecases/errors.js"
// import {Cart, CartItem, Variant} from "../../../core/entities/index.js"

// describe("CartController", () => {
//     let mockUsecase: ICartUsecase
//     let controller: CartController
//     let mockReq: Partial<Request>
//     let mockRes: Partial<Response>

//     beforeEach(() => {
//         // Tạo mock functions
//         mockUsecase = {
//             create: jest.fn<any>(),
//             findOneByUserId: jest.fn<any>(),
//             addItem: jest.fn<any>(),
//             removeItem: jest.fn<any>(),
//             deleteById: jest.fn<any>()
//         }

//         controller = new CartController(mockUsecase)

//         mockReq = {
//             user: { id: "user-123", role: "customer" } as any,
//             params: {},
//             body: {},
//             query: {}
//         }
        
//         const statusMock = jest.fn<any>().mockReturnThis()
//         const jsonMock = jest.fn<any>().mockReturnThis()
        
//         mockRes = {
//             status: statusMock,
//             json: jsonMock
//         } as any
//     })

//     describe("store", () => {
//         it("should create cart successfully", async () => {
//             const mockCart = new Cart({ id: "cart-1", userId: "user-123" })
//             ;(mockUsecase.create as Mock).mockResolvedValue(mockCart)

//             await controller.store(mockReq as Request, mockRes as Response)

//             expect(mockUsecase.create).toHaveBeenCalledWith({ userId: "user-123" })
//             expect(mockRes.status).toHaveBeenCalledWith(201)
//             expect(mockRes.json).toHaveBeenCalledWith({
//                 cart: expect.objectContaining({ id: "cart-1", userId: "user-123" })
//             })
//         })

//         it("should return 401 if user not authenticated", async () => {
//             mockReq.user = undefined

//             await controller.store(mockReq as Request, mockRes as Response)

//             expect(mockRes.status).toHaveBeenCalledWith(401)
//             expect(mockRes.json).toHaveBeenCalledWith({ message: "Unauthorized" })
//             expect(mockUsecase.create).not.toHaveBeenCalled()
//         })

//         it("should return 500 on INITIAL error", async () => {
//             ;(mockUsecase.create as Mock).mockRejectedValue(
//                 new USECASE_ERROR({ message: "Init error", code: USECASE_ERROR_CODE.INITIAL })
//             )

//             await controller.store(mockReq as Request, mockRes as Response)

//             expect(mockRes.status).toHaveBeenCalledWith(500)
//             expect(mockRes.json).toHaveBeenCalledWith({ message: "Server Internal Error!" })
//         })

//         it("should return 500 on unknown error", async () => {
//             ;(mockUsecase.create as Mock).mockRejectedValue(new Error("Unknown"))

//             await controller.store(mockReq as Request, mockRes as Response)

//             expect(mockRes.status).toHaveBeenCalledWith(500)
//             expect(mockRes.json).toHaveBeenCalledWith({ message: "Server Internal Error!" })
//         })
//     })

//     describe("showCurrent", () => {
//         it("should return current user cart without items", async () => {
//             const mockCart = new Cart({ id: "cart-1", userId: "user-123" })
//             ;(mockUsecase.findOneByUserId as Mock).mockResolvedValue(mockCart)
//             mockReq.query = {}

//             await controller.showCurrent(mockReq as Request, mockRes as Response)

//             expect(mockUsecase.findOneByUserId).toHaveBeenCalledWith({
//                 userId: "user-123",
//                 include: false
//             })
//             expect(mockRes.status).toHaveBeenCalledWith(200)
//             expect(mockRes.json).toHaveBeenCalledWith({
//                 cart: expect.objectContaining({ id: "cart-1", userId: "user-123" })
//             })
//         })

//         it("should return cart with items when include=1", async () => {
//             const mockVariant = new Variant({
//                 id: "var-1",
//                 name: "Test Variant",
//                 sku: "SKU-001",
//                 price: 100,
//                 stock: 10,
//                 productId: "prod-1"
//             })
//             const mockCartItem = new CartItem({
//                 id: "item-1",
//                 cartId: "cart-1",
//                 variantId: "var-1",
//                 quantity: 2,
//                 variant: mockVariant
//             })
//             const mockCart = new Cart({
//                 id: "cart-1",
//                 userId: "user-123",
//                 cartItems: [mockCartItem]
//             })
//             ;(mockUsecase.findOneByUserId as Mock).mockResolvedValue(mockCart)
//             mockReq.query = { include: "1" }

//             await controller.showCurrent(mockReq as Request, mockRes as Response)

//             expect(mockUsecase.findOneByUserId).toHaveBeenCalledWith({
//                 userId: "user-123",
//                 include: true
//             })
//             expect(mockRes.status).toHaveBeenCalledWith(200)
//         })

//         it("should allow admin to query other user cart", async () => {
//             mockReq.user = { id: "admin-1", role: "Administrator" } as any
//             mockReq.query = { userId: "user-456" }
//             const mockCart = new Cart({ id: "cart-2", userId: "user-456" })
//             ;(mockUsecase.findOneByUserId as Mock).mockResolvedValue(mockCart)

//             await controller.showCurrent(mockReq as Request, mockRes as Response)

//             expect(mockUsecase.findOneByUserId).toHaveBeenCalledWith({
//                 userId: "user-456",
//                 include: false
//             })
//             expect(mockRes.status).toHaveBeenCalledWith(200)
//         })

//         it("should ignore userId query param for non-admin", async () => {
//             mockReq.query = { userId: "user-456" }
//             const mockCart = new Cart({ id: "cart-1", userId: "user-123" })
//             ;(mockUsecase.findOneByUserId as Mock).mockResolvedValue(mockCart)

//             await controller.showCurrent(mockReq as Request, mockRes as Response)

//             expect(mockUsecase.findOneByUserId).toHaveBeenCalledWith({
//                 userId: "user-123",
//                 include: false
//             })
//         })

//         it("should return 404 if cart not found", async () => {
//             ;(mockUsecase.findOneByUserId as Mock).mockResolvedValue(null)

//             await controller.showCurrent(mockReq as Request, mockRes as Response)

//             expect(mockRes.status).toHaveBeenCalledWith(404)
//             expect(mockRes.json).toHaveBeenCalledWith({ message: "Cart not found" })
//         })

//         it("should return 401 if not authenticated", async () => {
//             mockReq.user = undefined

//             await controller.showCurrent(mockReq as Request, mockRes as Response)

//             expect(mockRes.status).toHaveBeenCalledWith(401)
//         })

//         it("should return 400 on invalid query params", async () => {
//             mockReq.query = { include: "invalid" }

//             await controller.showCurrent(mockReq as Request, mockRes as Response)

//             expect(mockRes.status).toHaveBeenCalledWith(400)
//             expect(mockRes.json).toHaveBeenCalledWith({ message: "Invalid input" })
//         })
//     })

//     describe("storeItem", () => {
//         it("should add item to cart successfully", async () => {
//             mockReq.params = { cartId: "cart-1" }
//             mockReq.body = { variantId: "var-1", quantity: 3 }
//             const mockCart = new Cart({ id: "cart-1", userId: "user-123" })
//             ;(mockUsecase.findOneByUserId as Mock).mockResolvedValue(mockCart)
//             ;(mockUsecase.addItem as Mock).mockResolvedValue(undefined)

//             await controller.storeItem(mockReq as Request, mockRes as Response)

//             expect(mockUsecase.addItem).toHaveBeenCalledWith({
//                 cartId: "cart-1",
//                 variantId: "var-1",
//                 quantity: 3
//             })
//             expect(mockRes.status).toHaveBeenCalledWith(201)
//             expect(mockRes.json).toHaveBeenCalledWith({ message: "Item added" })
//         })

//         it("should use default quantity 1 if not provided", async () => {
//             mockReq.params = { cartId: "cart-1" }
//             mockReq.body = { variantId: "var-1" }
//             const mockCart = new Cart({ id: "cart-1", userId: "user-123" })
//             ;(mockUsecase.findOneByUserId as Mock).mockResolvedValue(mockCart)
//             ;(mockUsecase.addItem as Mock).mockResolvedValue(undefined)

//             await controller.storeItem(mockReq as Request, mockRes as Response)

//             expect(mockUsecase.addItem).toHaveBeenCalledWith({
//                 cartId: "cart-1",
//                 variantId: "var-1",
//                 quantity: 1
//             })
//         })

//         it("should return 403 if non-admin tries to add to other user cart", async () => {
//             mockReq.params = { cartId: "cart-2" }
//             mockReq.body = { variantId: "var-1" }
//             const mockCart = new Cart({ id: "cart-1", userId: "user-123" })
//             ;(mockUsecase.findOneByUserId as Mock).mockResolvedValue(mockCart)

//             await controller.storeItem(mockReq as Request, mockRes as Response)

//             expect(mockRes.status).toHaveBeenCalledWith(403)
//             expect(mockRes.json).toHaveBeenCalledWith({ message: "Forbidden" })
//             expect(mockUsecase.addItem).not.toHaveBeenCalled()
//         })

//         it("should allow admin to add to any cart", async () => {
//             mockReq.user = { id: "admin-1", role: "Administrator" } as any
//             mockReq.params = { cartId: "cart-2" }
//             mockReq.body = { variantId: "var-1" }
//             ;(mockUsecase.addItem as Mock).mockResolvedValue(undefined)

//             await controller.storeItem(mockReq as Request, mockRes as Response)

//             expect(mockUsecase.findOneByUserId).not.toHaveBeenCalled()
//             expect(mockUsecase.addItem).toHaveBeenCalled()
//             expect(mockRes.status).toHaveBeenCalledWith(201)
//         })

//         it("should return 404 on constraint error", async () => {
//             mockReq.params = { cartId: "cart-1" }
//             mockReq.body = { variantId: "var-1" }
//             const mockCart = new Cart({ id: "cart-1", userId: "user-123" })
//             ;(mockUsecase.findOneByUserId as Mock).mockResolvedValue(mockCart)
//             ;(mockUsecase.addItem as Mock).mockRejectedValue(
//                 new USECASE_ERROR({ message: "Not found", code: USECASE_ERROR_CODE.CONSTRAINT })
//             )

//             await controller.storeItem(mockReq as Request, mockRes as Response)

//             expect(mockRes.status).toHaveBeenCalledWith(404)
//             expect(mockRes.json).toHaveBeenCalledWith({ message: "Cart or Variant not found" })
//         })

//         it("should return 400 on invalid input", async () => {
//             mockReq.params = { cartId: "cart-1" }
//             mockReq.body = { quantity: -1 }

//             await controller.storeItem(mockReq as Request, mockRes as Response)

//             expect(mockRes.status).toHaveBeenCalledWith(400)
//             expect(mockRes.json).toHaveBeenCalledWith({ message: "Invalid input" })
//         })
//     })

//     describe("updateItem", () => {
//         it("should update item quantity successfully", async () => {
//             mockReq.params = { cartId: "cart-1", variantId: "var-1" }
//             mockReq.body = { quantity: 5 }
//             const mockCart = new Cart({ id: "cart-1", userId: "user-123" })
//             ;(mockUsecase.findOneByUserId as Mock).mockResolvedValue(mockCart)
//             ;(mockUsecase.removeItem as Mock).mockResolvedValue(undefined)
//             ;(mockUsecase.addItem as Mock).mockResolvedValue(undefined)

//             await controller.updateItem(mockReq as Request, mockRes as Response)

//             expect(mockUsecase.removeItem).toHaveBeenCalledWith({
//                 cartId: "cart-1",
//                 variantId: "var-1"
//             })
//             expect(mockUsecase.addItem).toHaveBeenCalledWith({
//                 cartId: "cart-1",
//                 variantId: "var-1",
//                 quantity: 5
//             })
//             expect(mockRes.status).toHaveBeenCalledWith(200)
//             expect(mockRes.json).toHaveBeenCalledWith({ message: "Quantity updated" })
//         })

//         it("should remove item if quantity is 0", async () => {
//             mockReq.params = { cartId: "cart-1", variantId: "var-1" }
//             mockReq.body = { quantity: 0 }
//             const mockCart = new Cart({ id: "cart-1", userId: "user-123" })
//             ;(mockUsecase.findOneByUserId as Mock).mockResolvedValue(mockCart)
//             ;(mockUsecase.removeItem as Mock).mockResolvedValue(undefined)

//             await controller.updateItem(mockReq as Request, mockRes as Response)

//             expect(mockUsecase.removeItem).toHaveBeenCalledWith({
//                 cartId: "cart-1",
//                 variantId: "var-1"
//             })
//             expect(mockUsecase.addItem).not.toHaveBeenCalled()
//             expect(mockRes.status).toHaveBeenCalledWith(200)
//             expect(mockRes.json).toHaveBeenCalledWith({ message: "Item removed" })
//         })
//     })

//     describe("destroyItem", () => {
//         it("should remove item successfully", async () => {
//             mockReq.params = { cartId: "cart-1", variantId: "var-1" }
//             const mockCart = new Cart({ id: "cart-1", userId: "user-123" })
//             ;(mockUsecase.findOneByUserId as Mock).mockResolvedValue(mockCart)
//             ;(mockUsecase.removeItem as Mock).mockResolvedValue(undefined)

//             await controller.destroyItem(mockReq as Request, mockRes as Response)

//             expect(mockUsecase.removeItem).toHaveBeenCalledWith({
//                 cartId: "cart-1",
//                 variantId: "var-1"
//             })
//             expect(mockRes.status).toHaveBeenCalledWith(200)
//             expect(mockRes.json).toHaveBeenCalledWith({ message: "Item removed" })
//         })
//     })

//     describe("destroy", () => {
//         it("should delete cart successfully", async () => {
//             mockReq.params = { id: "cart-1" }
//             ;(mockUsecase.deleteById as Mock).mockResolvedValue(undefined)

//             await controller.destroy(mockReq as Request, mockRes as Response)

//             expect(mockUsecase.deleteById).toHaveBeenCalledWith({
//                 id: "cart-1",
//                 userId: "user-123"
//             })
//             expect(mockRes.status).toHaveBeenCalledWith(200)
//             expect(mockRes.json).toHaveBeenCalledWith({ message: "OK" })
//         })

//         it("should return 404 if cart not found", async () => {
//             mockReq.params = { id: "cart-999" }
//             ;(mockUsecase.deleteById as Mock).mockRejectedValue(
//                 new USECASE_ERROR({ message: "Not found", code: USECASE_ERROR_CODE.NOTFOUND })
//             )

//             await controller.destroy(mockReq as Request, mockRes as Response)

//             expect(mockRes.status).toHaveBeenCalledWith(404)
//             expect(mockRes.json).toHaveBeenCalledWith({
//                 message: "Cart not found or you don't own this resource"
//             })
//         })
//     })
// })