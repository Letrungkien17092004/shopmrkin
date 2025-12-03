import axios, { AxiosError } from "axios"
import VariantService from "./VariantService.ts"
import { Variant, Product } from "../types/index.ts"
import AuthService from "./AuthService.ts"
import { ENV } from "../config/ENV.ts"
// const variantService = new VariantService()
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



const DEFAULT_MEDIA = {
    fileName: "vn-11134207-7ra0g-m6gngdko0gip8d.webp",
    filePath: "/file/vn-11134207-7ra0g-m6gngdko0gip8d.webp",
    hostname: "https://down-vn.img.susercontent.com"
}
function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export default class ProductService {

    /**
     * Create a Product
     * @param options 
     * @returns 
     */
    async create(data: {
        name: string,
        description: string,
        categoryId: number
    }): Promise<Product> {
        try {
            if (authService.accessIsExpired()) {
                await authService.refeshAccess()
            }
            const response = await axios.post<CreateProductResponse>(
                `${ENV.BACK_END_HOST}/api/product/`,
                {
                    name: data.name,
                    description: data.description,
                    categoryId: data.categoryId
                },
                {
                    headers: {
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
                category: "Need Code",
                media: [DEFAULT_MEDIA],
                variants: [],
                createdAt: new Date(product.createdAt),
                updatedAt: new Date(product.updatedAt)
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
    async getAll(options:{
        include?: {
            user?: boolean,
            variants?: boolean,
            media?: boolean
        }
    }): Promise<Product[]> {
        try {
            var includeQuery = ""
            if (options?.include?.user) {
                includeQuery += "include[user]=true&"
            }
            if (options?.include?.variants) {
                includeQuery += "include[variants]=true&"
            }
            if (options?.include?.media) {
                includeQuery += "include[media]=true&"
            }
            if (includeQuery.length !== 0) {
                includeQuery = includeQuery.slice(0, -1)
            }
            const response = await axios.get<GetAllProductResponse>(`${ENV.BACK_END_HOST}/api/products?${includeQuery}`)
            const products = response.data.products
            return products.map(p => {
                const media = p.media.length !== 0 ? p.media : [DEFAULT_MEDIA]
                return new Product({
                    id: p.id,
                    name: p.name,
                    product_code: p.product_code,
                    description: p.description,
                    category: "TODO",
                    media: media,
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
                })
            })
        } catch (error) {
            console.log(error)
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
            const response = await axios.get<{ product: ProductResponse }>(`${ENV.BACK_END_HOST}/api/product/${id}?include[user]=true&include[variants]=true&include[media]=true`)
            const productData = response.data.product
            return new Product({
                id: productData.id,
                name: productData.name,
                product_code: productData.product_code,
                description: productData.description,
                category: productData.category,
                media: productData.media.length!==0?productData.media:[DEFAULT_MEDIA],
                variants: productData.variants.map(v => new Variant({
                    id: v.id,
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