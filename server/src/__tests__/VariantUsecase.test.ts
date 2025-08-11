import VariantUsecase from "core/applications/usecases/VariantUsecase.js";
import { USECASE_ERROR, USECASE_ERROR_CODE } from "core/applications/interfaces/usecases/errors.js";
import VariantRepository from "repositories/VariantRepository.js";
import { PrismaClient } from "services/postgresSQL/generated/prisma/client";

describe("Variant usecase testing", () => {
    var repo: VariantRepository
    var usecase: VariantUsecase
    var prisma: PrismaClient

    const data1 = {
        name: "product 1 Variant",
        sku: "A01",
        productId: "01988015-fdf0-7072-940c-259e594f37dd",
        authorId: "ac",
        price: 100000,
        stock: 1000
    }

    beforeAll(() => {
        repo = new VariantRepository()
        usecase = new VariantUsecase(repo)
        prisma = new PrismaClient()
    })

    afterAll(async () => {
        await prisma.$disconnect()
    })

    test('Create and Update a new variant', async () => {
        const createdVariant = await usecase.create(data1)
        const updatedVariant = await usecase.updateById(createdVariant.id, createdVariant.authorId, {
            name: "new name"
        })
        expect(createdVariant).toMatchObject(data1)
        expect(updatedVariant).toMatchObject({
            name: "new name"
        })

    })

    test("Create a variant with existed SKU property", async () => {
        try {
            await usecase.create(data1)
            throw new Error("Expected USECASE_ERROR but nothing was thrown");
        } catch (error) {
            expect(error).toBeInstanceOf(USECASE_ERROR)
            expect((error as USECASE_ERROR).code).toBe(USECASE_ERROR_CODE.EXISTED)
        }
    })

    test("Update a wrong variant", async () => {
        try {
            await usecase.updateById("abc", "abc", {
                name: "demo"
            })
            throw new Error("Expected USECASE_ERROR but nothing was thrown");
        } catch (error) {
            expect(error).toBeInstanceOf(USECASE_ERROR)
            expect((error as USECASE_ERROR).code).toBe(USECASE_ERROR_CODE.NOTFOUND)
        }
    })

    test("Create and find a variant", async () => {
        const data = {
            name: "product 2 Variant",
            sku: "A02",
            productId: "01988015-fdf0-7072-940c-259e594f37dd",
            authorId: "abcs",
            price: 100000,
            stock: 1000
        }
        const createdVariant = await usecase.create(data)
        const searchedVariant = await usecase.getById(createdVariant.id)

        expect(createdVariant).toMatchObject(data)
        expect(searchedVariant).toMatchObject(data)

    })
})