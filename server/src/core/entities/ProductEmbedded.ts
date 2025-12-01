
interface ProductEmbeddedContructorParam {
    id: string
    originProductId: string
    name: string
    describe: string
    nameVector: string
    describeVector: string
    createdAt: Date
    updatedAt: Date
}

export default class ProductEmbedded {
    id: string
    originProductId: string
    name: string
    describe: string
    nameVector: string
    describeVector: string
    createdAt: Date
    updatedAt: Date

    constructor(options: ProductEmbeddedContructorParam) {
        this.id = options.id
        this.originProductId = options.originProductId
        this.name = options.name
        this.describe = options.describe
        this.nameVector = options.nameVector
        this.describeVector = options.describeVector
        this.createdAt = options.createdAt
        this.updatedAt = options.updatedAt
    }
}