
type VariantConstructorParam = {
    id: string
    name: string
    sku: string
    price: number
    stock: number
    productId: string,
}
export function validVariant(variant: Variant): boolean {
    if (variant.name.length < 5) return false
    if (variant.sku.length < 5) return false
    if (variant.price < 0) return false
    if (variant.stock < 0) return false
    return true
}

export class Variant {
    id: string
    name: string
    sku: string
    price: number
    stock: number
    productId: string

    constructor(options: VariantConstructorParam) {
        this.id = options.id
        this.name = options.name
        this.sku = options.sku
        this.price = options.price
        this.stock = options.stock
        this.productId = options.productId
    }
}

let demoRepo: Variant[] = [
    {
        id: "001",
        name: "OPTION 1",
        sku: "OP1PROD1",
        price: 10000,
        stock: 10,
        productId: "00001"
    },
    {
        id: "002",
        name: "OPTION 2",
        sku: "OP2PROD1",
        price: 50000,
        stock: 10,
        productId: "00001"
    },
    {
        id: "003",
        name: "OPTION 1",
        sku: "OP1PROD2",
        price: 20000,
        stock: 15,
        productId: "00002"
    },
    {
        id: "004",
        name: "OPTION 2",
        sku: "OP2PROD2",
        price: 40000,
        stock: 20,
        productId: "00002"
    },
    {
        id: "005",
        name: "OPTION 1",
        sku: "OP1PROD3",
        price: 99000,
        stock: 99,
        productId: "00003"
    },
]
let currentId = 3
export default class VariantService {
    async create(options: Omit<Variant, "id">): Promise<Variant> {
        try {
            const isNotExisted = demoRepo.every(v => v.sku !== options.sku)
            if (!isNotExisted) { throw new Error("resoucre already exist") }
            currentId++
            const newVariant = new Variant({
                id: `00${currentId}`,
                name: options.name,
                sku: options.sku,
                price: options.price,
                stock: options.stock,
                productId: options.productId
            })
            demoRepo.push(newVariant)
            return { ...newVariant }
        } catch (error) {
            throw error
        }
    }

    async getManyByProductId(productId: string): Promise<Variant[]> {
        try {
            const variants: Variant[] = demoRepo.filter(v => v.productId === productId)
            return [...variants]
        } catch (error) {
            throw error
        }
    }

    async updateById(id: string, options: Partial<Omit<Variant, "id" | "productId">>): Promise<Variant> {
        try {
            const variant = demoRepo.find(v => v.id === id)
            if (!variant) { throw new Error("not found") }
            variant.name = options.name || variant.name
            variant.sku = options.sku || variant.sku
            variant.price = options.price || variant.price
            variant.stock = options.stock || variant.stock
            return { ...variant }
        } catch (error) {
            throw error
        }
    }

    async deleteById(id: string): Promise<void> {
        try {
            const isExist = demoRepo.find(v => v.id == id)
            if (!isExist) { throw new Error("not found") }
            demoRepo = demoRepo.filter(v => v.id !== id)
        } catch (error) {
            throw error
        }
    }
}

