// // Import Jest functions explicitly - QUAN TRỌNG!
// import { describe, it, expect, jest } from '@jest/globals'
// import type { Mock } from 'jest-mock'
// import { Request, Response } from "express"
// import CartUsecase from "../../../../core/applications/usecases/CartUsecase.js"
// import CartRepository from '../../../../repositories/CartRepository.js'
// import { REPO_ERROR, REPO_ERROR_CODE } from "../../../../core/applications/interfaces/repositories/errors.js"
// import { USECASE_ERROR, USECASE_ERROR_CODE } from "../../../../core/applications/interfaces/usecases/errors.js"
// import { Cart, Variant, CartItem } from "../../../../core/entities/index.js"

// describe("CartUsecase", () => {
//     let cartRepo: CartRepository
//     let usecase: CartUsecase

//     beforeEach(() => {
//         cartRepo = new CartRepository()
//         usecase = new CartUsecase(cartRepo)
//     })

//     describe("create", () => {
//         it("should create cart successfully", async () => {
//             const mockCart = new Cart({ id: "cart-1", userId: "user-123" })

//             const result = await usecase.create({ userId: "user-123" })

//             expect(cartRepo.create).toHaveBeenCalledWith({ userId: "user-123" })
//             expect(result).toEqual(mockCart)
//             expect(result.id).toBe("cart-1")
//             expect(result.userId).toBe("user-123")
//         })

//         it("should throw USECASE_ERROR with INITIAL code on REPO_ERROR with INITIAL code", async () => {
//             await expect(usecase.create({ userId: "user-123" })).rejects.toThrow(USECASE_ERROR)
//             await expect(usecase.create({ userId: "user-123" })).rejects.toMatchObject({
//                 code: USECASE_ERROR_CODE.INITIAL
//             })
//         })

//         it("should throw USECASE_ERROR with UNDEFINED code on unknown error", async () => {
//             await expect(usecase.create({ userId: "user-123" })).rejects.toThrow(USECASE_ERROR)
//             await expect(usecase.create({ userId: "user-123" })).rejects.toMatchObject({
//                 code: USECASE_ERROR_CODE.UNDEFINED
//             })
//         })
//     })

//     describe("findOneByUserId", () => {
//         it("should find cart by userId without includes", async () => {
//             const mockCart = new Cart({ id: "cart-1", userId: "user-123" })

//             const result = await usecase.findOneByUserId({ userId: "user-123" })

//             expect(cartRepo.findOneByUserId).toHaveBeenCalledWith({
//                 userId: "user-123",
//                 include: undefined
//             })
//             expect(result).toEqual(mockCart)
//         })

//         it("should find cart by userId with includes", async () => {
//             const mockVariant = new Variant({
//                 id: "var-1",
//                 name: "Test Variant",
//                 sku: "SKU-001",
//                 price: 100,
//                 stock: 10,
//                 userId: "019a1fb4-df25-7592-a399-8c82499da239",
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

//             const result = await usecase.findOneByUserId({ userId: "user-123", include: true })

//             expect(cartRepo.findOneByUserId).toHaveBeenCalledWith({
//                 userId: "user-123",
//                 include: true
//             })
//             expect(result).toEqual(mockCart)
//             expect(result?.cartItems).toHaveLength(1)
//             expect(result?.cartItems?.[0].variant).toBeDefined()
//         })

//         it("should return null if cart not found", async () => {

//             const result = await usecase.findOneByUserId({ userId: "user-999" })

//             expect(result).toBeNull()
//         })

//         it("should throw USECASE_ERROR with INITIAL code on REPO_ERROR", async () => {

//             await expect(usecase.findOneByUserId({ userId: "user-123" })).rejects.toThrow(USECASE_ERROR)
//             await expect(usecase.findOneByUserId({ userId: "user-123" })).rejects.toMatchObject({
//                 code: USECASE_ERROR_CODE.INITIAL
//             })
//         })

//         it("should throw USECASE_ERROR with UNDEFINED code on unknown error", async () => {

//             await expect(usecase.findOneByUserId({ userId: "user-123" })).rejects.toThrow(USECASE_ERROR)
//             await expect(usecase.findOneByUserId({ userId: "user-123" })).rejects.toMatchObject({
//                 code: USECASE_ERROR_CODE.UNDEFINED
//             })
//         })
//     })

//     describe("addItem", () => {
//         it("should add item to cart successfully", async () => {

//             await usecase.addItem({ cartId: "cart-1", variantId: "var-1", quantity: 3 })

//             expect(cartRepo.createOrUpdateItem).toHaveBeenCalledWith({
//                 cartId: "cart-1",
//                 variantId: "var-1",
//                 quantity: 3
//             })
//         })

//         it("should throw USECASE_ERROR with CONSTRAINT code on foreign key constraint error", async () => {
           
//             await expect(
//                 usecase.addItem({ cartId: "cart-999", variantId: "var-1", quantity: 1 })
//             ).rejects.toThrow(USECASE_ERROR)

//             await expect(
//                 usecase.addItem({ cartId: "cart-999", variantId: "var-1", quantity: 1 })
//             ).rejects.toMatchObject({
//                 code: USECASE_ERROR_CODE.CONSTRAINT,
//                 message: "Cart or Variant not found"
//             })
//         })

//         it("should throw USECASE_ERROR with INITIAL code on REPO_ERROR", async () => {
//             await expect(
//                 usecase.addItem({ cartId: "cart-1", variantId: "var-1", quantity: 1 })
//             ).rejects.toThrow(USECASE_ERROR)

//             await expect(
//                 usecase.addItem({ cartId: "cart-1", variantId: "var-1", quantity: 1 })
//             ).rejects.toMatchObject({
//                 code: USECASE_ERROR_CODE.INITIAL
//             })
//         })

//         it("should throw USECASE_ERROR with UNDEFINED code on unknown error", async () => {

//             await expect(
//                 usecase.addItem({ cartId: "cart-1", variantId: "var-1", quantity: 1 })
//             ).rejects.toThrow(USECASE_ERROR)

//             await expect(
//                 usecase.addItem({ cartId: "cart-1", variantId: "var-1", quantity: 1 })
//             ).rejects.toMatchObject({
//                 code: USECASE_ERROR_CODE.UNDEFINED
//             })
//         })
//     })

//     describe("removeItem", () => {
//         it("should remove item from cart successfully", async () => {

//             await usecase.removeItem({ cartId: "cart-1", variantId: "var-1" })

//             expect(cartRepo.removeItem).toHaveBeenCalledWith({
//                 cartId: "cart-1",
//                 variantId: "var-1"
//             })
//         })

//         it("should throw USECASE_ERROR with INITIAL code on REPO_ERROR", async () => {

//             await expect(
//                 usecase.removeItem({ cartId: "cart-1", variantId: "var-1" })
//             ).rejects.toThrow(USECASE_ERROR)

//             await expect(
//                 usecase.removeItem({ cartId: "cart-1", variantId: "var-1" })
//             ).rejects.toMatchObject({
//                 code: USECASE_ERROR_CODE.INITIAL
//             })
//         })

//         it("should throw USECASE_ERROR with UNDEFINED code on unknown error", async () => {

//             await expect(
//                 usecase.removeItem({ cartId: "cart-1", variantId: "var-1" })
//             ).rejects.toThrow(USECASE_ERROR)

//             await expect(
//                 usecase.removeItem({ cartId: "cart-1", variantId: "var-1" })
//             ).rejects.toMatchObject({
//                 code: USECASE_ERROR_CODE.UNDEFINED
//             })
//         })
//     })

//     describe("deleteById", () => {
//         it("should delete cart successfully", async () => {

//             await usecase.deleteById({ id: "cart-1", userId: "user-123" })

//             expect(cartRepo.deleteById).toHaveBeenCalledWith({
//                 id: "cart-1",
//                 userId: "user-123"
//             })
//         })

//         it("should throw USECASE_ERROR with NOTFOUND code on REPO_ERROR with NOTFOUND", async () => {

//             await expect(
//                 usecase.deleteById({ id: "cart-999", userId: "user-123" })
//             ).rejects.toThrow(USECASE_ERROR)

//             await expect(
//                 usecase.deleteById({ id: "cart-999", userId: "user-123" })
//             ).rejects.toMatchObject({
//                 code: USECASE_ERROR_CODE.NOTFOUND
//             })
//         })

//         it("should throw USECASE_ERROR with INITIAL code on REPO_ERROR with INITIAL", async () => {

//             await expect(
//                 usecase.deleteById({ id: "cart-1", userId: "user-123" })
//             ).rejects.toThrow(USECASE_ERROR)

//             await expect(
//                 usecase.deleteById({ id: "cart-1", userId: "user-123" })
//             ).rejects.toMatchObject({
//                 code: USECASE_ERROR_CODE.INITIAL
//             })
//         })

//         it("should throw USECASE_ERROR with UNDEFINED code on unknown error", async () => {

//             await expect(
//                 usecase.deleteById({ id: "cart-1", userId: "user-123" })
//             ).rejects.toThrow(USECASE_ERROR)

//             await expect(
//                 usecase.deleteById({ id: "cart-1", userId: "user-123" })
//             ).rejects.toMatchObject({
//                 code: USECASE_ERROR_CODE.UNDEFINED
//             })
//         })
//     })
// })


