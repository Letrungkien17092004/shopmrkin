import Category from "./Category.js"

type ProductConstructorParam = {
    id: string,
    product_code: number,
    name: String,
    description: string,
    // relation
    categoryId: number,
    category?: Category,
    //   variants Variants[]

    // time
    createdAt: Date,
    updatedAt: Date
}

export default class Product {
    id: string
    product_code: number 
    name: String
    description: string
    categoryId: number
    category?: Category
    //   variants Variants[]
    createdAt: Date
    updatedAt: Date

    constructor(options: ProductConstructorParam) {
        this.id = options.id
        this.product_code = options.product_code
        this.name = options.name
        this.description = options.description
        this.categoryId = options.categoryId
        this.category = options.category
        //   variants Variants[]
        this.createdAt = options.createdAt
        this.updatedAt = options.updatedAt
    }
}