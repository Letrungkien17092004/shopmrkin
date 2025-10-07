import axios, { AxiosError } from "axios"
import VariantService, { Variant } from "./VariantService.ts"
import AuthService from "./AuthService.ts"
import { ENV } from "../config/ENV.ts"
const variantService = new VariantService()
const authService = new AuthService()

type ProductResponse = {
    id: string,
    product_code: number,
    name: string,
    description: string,
    user?: {
        username: string,
        role?: string
    },
    category: string,
    media: { fileName: string, filePath: string, hostname: string }[],
    variants: {
        id: string,
        name: string,
        sku: string,
        productId: string,
        price: number,
        stock: number
    }[],
    createdAt: string,
    updatedAt: string
}
type CreateProductResponse = {
    product: ProductResponse
}

type GetAllProductResponse = {
    products: ProductResponse[]
}

export type ProductConstructorParam = {
    id: string
    name: string
    product_code: number
    description: string
    category: string
    media: { fileName: string, filePath: string, hostname: string }[]
    variants: Variant[]
    user?: {
        username: string,
        role?: string
    }
    createdAt: Date
    updatedAt: Date
}

export class Product {
    id: string
    name: string
    product_code: number
    description: string
    category: string
    media: { fileName: string, filePath: string, hostname: string }[]
    variants: Variant[]
    user?: {
        username: string,
        role?: string
    }
    createdAt: Date
    updatedAt: Date

    constructor(options: ProductConstructorParam) {
        this.id = options.id
        this.name = options.name
        this.product_code = options.product_code
        this.description = options.description
        this.category = options.category
        this.media = options.media
        this.variants = options.variants
        this.user = options.user
        this.createdAt = options.createdAt
        this.updatedAt = options.updatedAt
    }

    public get stock(): number {
        let totalStock = 0
        this.variants.forEach(variant => totalStock += variant.stock)
        return totalStock
    }

    public get minPrice(): number {
        let min_ = this.variants[0]?.price || 0
        this.variants.forEach((variant) => {
            if (variant.price < min_) {
                min_ = variant.price
            }
        })
        return min_
    }

    public get maxPrice(): number {
        let max_ = this.variants[0]?.price || 999999999999

        this.variants.forEach((variant) => {
            if (variant.price > max_) {
                max_ = variant.price
            }
        })
        return max_
    }

}

const demoImage = "https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m6gngdko0gip8d.webp"

function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export default class ProductService {

    /**
     * Create a Product
     * @param options 
     * @returns 
     */
    async create(options: Omit<Product, "id" | "productCode" | "variants" | "createdAt" | "updatedAt" | "stock" | "minPrice" | "maxPrice">): Promise<Product> {
        try {
            if (authService.accessIsExpired()) {
                await authService.refeshAccess()
            }
            const response = await axios.post<CreateProductResponse>(
                `${ENV.BACK_END_HOST}/api/product/`,
                {
                    name: options.name,
                    description: options.description,
                    categoryId: 1
                },
                {
                    headers: {
                        Authorization: `Bearer ${authService.getAccessToken()}`
                    }
                }
            )
            console.log(response)
            return new Product({
                id: response.data.product.id,
                name: response.data.product.name,
                product_code: response.data.product.product_code,
                description: response.data.product.description,
                category: "Need Code",
                media: [{ fileName: "", filePath: demoImage, hostname: "" }],
                variants: [],
                createdAt: new Date(response.data.product.createdAt),
                updatedAt: new Date(response.data.product.updatedAt)
            })
        } catch (error) {
            console.log(error)
            throw new Error("ProductService Error: createData")
        }
    }

    /**
     * Update a Product by product's id
     * @param id 
     * @param options 
     */
    async updateById(id: string, options: Partial<Omit<Product, "id" | "variants">>): Promise<Product> {
        try {
            if (authService.accessIsExpired()) {
                await authService.refeshAccess()
            }
            const response = await axios.put<{ product: ProductResponse }>(`${ENV.BACK_END_HOST}/api/product/${id}`,
                {
                    name: options.name,
                    description: options.description
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${authService.getAccessToken()}`
                    }
                }
            )
            const product = response.data.product
            return new Product({
                id: product.id,
                name: product.name,
                product_code: product.product_code,
                description: product.description,
                category: product.category,
                media: product.media,
                variants: product.variants.map(v => new Variant({
                    id: "",
                    name: v.name,
                    sku: v.sku,
                    price: v.price,
                    stock: v.stock,
                    productId: product.id,
                    userId: ""
                })),
                user: product.user,
                createdAt: new Date(product.createdAt),
                updatedAt: new Date(product.updatedAt)
            })
        } catch (error) {
            throw error
        }
    }

    /**
     * Find many product
     * @returns 
     */
    async getAll(): Promise<Product[]> {
        try {
            const response = await axios.get<GetAllProductResponse>(`${ENV.BACK_END_HOST}/api/product?include=1`)
            const products = response.data.products
            console.log(products)
            return products.map(p => new Product({
                id: p.id,
                name: p.name,
                product_code: p.product_code,
                description: p.description,
                category: "TODO",
                media: [{ fileName: "", filePath: demoImage, hostname: "" }],
                variants: p.variants.map(v => new Variant({
                    id: "",
                    name: v.name,
                    sku: v.sku,
                    price: v.price,
                    stock: v.stock,
                    productId: p.id,
                    userId: ""
                })),
                createdAt: new Date(p.createdAt),
                updatedAt: new Date(p.updatedAt)
            }))
        } catch (error) {
            throw new Error("ProductService Error: getData")
        }
    }

    /**
     * Delete a product by product's id
     * @param id 
     */
    async deleteById(id: string): Promise<void> {
        try {
            if (authService.accessIsExpired()) {
                await authService.refeshAccess()
            }
            const response = await axios.delete(`${ENV.BACK_END_HOST}/api/product/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${authService.getAccessToken()}`
                    }
                }
            )
            console.log("deleteById status: ", response.status)
            console.log("data: ", response.data)
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.status === 401) {
                    window.alert("Phiên hết hạn vui lòng reload lại trang hoặc đăng nhập lại")
                }
            }
            throw error
        }
    }

    /**
     * Retrieve a product by product's id
     * @param id 
     * @returns 
     */
    async findById(id: string): Promise<Product | null> {
        try {
            const response = await axios.get<{ product: ProductResponse }>(`${ENV.BACK_END_HOST}/api/product/${id}?include=1`)
            const productData = response.data.product
            return new Product({
                id: productData.id,
                name: productData.name,
                product_code: productData.product_code,
                description: productData.description,
                category: productData.category,
                media: [{ fileName: "", filePath: demoImage, hostname: "" }],
                variants: productData.variants.map(v => new Variant({
                    id: "",
                    name: v.name,
                    sku: v.sku,
                    price: v.price,
                    stock: v.stock,
                    productId: productData.id,
                    userId: ""
                })),
                createdAt: new Date(productData.createdAt),
                updatedAt: new Date(productData.updatedAt)
            })
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.status === 404) {
                    return null
                }
            }
            throw error
        }
    }
}