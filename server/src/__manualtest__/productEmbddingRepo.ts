import ProductRepository from "../repositories/ProductRepository.js";
import ProductEmbeddingRepository from "../repositories/ProductEmbeddingRepository.js";
import EmbeddingService from "../services/embeddingService/EmbeddingService.js";
import { Product, ProductEmbedding } from "../core/entities/index.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()
const USERID = "019b1775-b969-7b32-ad14-92425874a198"
const demoProducts: Product[] = [
    {
        id: "",
        product_code: 0,
        name: "Điện thoại Iphone 17 promax",
        description: "Điện thoại Iphone 17 promax",
        userId: USERID,
        categoryId: 1
    },
    {
        id: "",
        product_code: 0,
        name: "Điện thoại Samsung galaxy s23 untra",
        description: "Điện thoại Samsung galaxy s23 untra",
        userId: USERID,
        categoryId: 1
    },
    {
        id: "",
        product_code: 0,
        name: "Điện thoại xiaomi note 7",
        description: "Điện thoại xiaomi note 7",
        userId: USERID,
        categoryId: 1
    },
    {
        id: "",
        product_code: 0,
        name: "Điện thoại oppo f7",
        description: "Điện thoại oppo f7",
        userId: USERID,
        categoryId: 1
    },
]
const embeddingService = new EmbeddingService()
const productRepo = new ProductRepository()
const embeddingRepo = new ProductEmbeddingRepository()

async function addProductAndEmbedding(data: {
    name: string,
    description: string,
    cateId: number,
    userId: string
}) {
    const createdProduct = await productRepo.create({
        data: {
            name: data.name,
            description: data.description,
            categoryId: data.cateId,
            userId: data.userId,
        }
    })

    const embeddingVector: number[] = (await embeddingService.embeddings([data.description]))[0]
    const createdProEmbed = await embeddingRepo.create({
        data: {
            productId: createdProduct.id,
            origin_text: data.description,
            embedding: embeddingVector
        }
    })
    console.log("Tạo thành công")
    console.log(createdProEmbed)
}

async function resetDB() {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "Products" CASCADE;`);
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "ProductEmbedding" CASCADE;`);
    console.log("resetDB ok")
}
async function main() {
    console.log("Start")

    // insert one by one
    await resetDB()
    for (let i = 0; i < demoProducts.length; i++) {
        const data = demoProducts[i]!
        await addProductAndEmbedding({
            name: data.name,
            description: data.description,
            cateId: data.categoryId || 1,
            userId: data.userId
        })
    }

    // insertMany
    // const items = []
    // const insertManyResult = await embeddingRepo.createMany()

    // embeddingSearch
    // const searchString = "Kiên"
    // const searchEmbedding = (await embeddingService.embeddings([searchString]))[0]
    // const searchResult = await embeddingRepo.embeddingSearch({
    //     where: {
    //         embedding: searchEmbedding
    //     }
    // })

    // console.log("Kết quả search \n", searchResult)

    // search by id
    // const searchId = "d63bfedd-72d5-4b4e-ae4b-0ae184a9a43c"
    // const searchByIdResult = await embeddingRepo.searchById({
    //     where: {
    //         id: searchId
    //     }
    // })

    // console.log("SearchById result: \n", searchByIdResult)
    

    // updateById
    // const textForUpdate = "Lê Trun Kiên"
    // const embeddingForUpdate = (await embeddingService.embeddings([textForUpdate]))[0]
    // const idForUpdate = "6a6bc923-0046-4308-92e8-07a83bf1cd91"
    // const updateResult = await embeddingRepo.updateById({
    //     where: {
    //         id: idForUpdate
    //     },
    //     data: {
    //         origin_text: textForUpdate,
    //         embedding: embeddingForUpdate
    //     }
    // })

    // console.log("update result\n", updateResult)
    console.log("End")
}

main()

