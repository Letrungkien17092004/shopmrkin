import axios, { AxiosError } from "axios"

import { Variant, Product } from "../types/product/index.ts"
import { Media } from "../types/media/index.ts"

import AuthService from "./AuthService.ts"
import { ENV } from "../config/ENV.ts"

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
    media: {
        id: string,
        fileName: string,
        filePath: string,
        media_type: "IMAGE" | "VIDEO"
    }[],
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
    products: ProductResponse[],
    pagination?: {
        total: number,
        page: number,
        limit: number,
        totalPages: number
    }
}

export type CategoryItem = {
    id: number,
    name: string,
    slug: string,
    productCount: number
}

export type PaginationMeta = {
    total: number,
    page: number,
    limit: number,
    totalPages: number
}

type GetSimilarProductsResponse = {
    product_id: string,
    products: (ProductResponse & {
        similarity_score?: number,
        similarity_updated_at?: string
    })[]
}



const DEFAULT_MEDIA = {
    id: "",
    fileName: "vn-11134207-7ra0g-m6gngdko0gip8d.webp",
    filePath: "/file/vn-11134207-7ra0g-m6gngdko0gip8d.webp",
    hostname: "https://down-vn.img.susercontent.com",
    media_type: 'IMAGE' as const
}

export default class ProductService {
    private readonly authService: AuthService

    constructor(authService: AuthService) {
        this.authService = authService
    }

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
            if (this.authService.accessIsExpired()) {
                await this.authService.refeshAccess()
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
                        Authorization: `Bearer ${this.authService.getAccessToken()}`
                    }
                }
            )
            const product = response.data.product
            return ({
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
    async updateById(id: string, options: Partial<Omit<Product, "id" | "variants">> & { categoryId?: number }): Promise<void> {
        try {
            if (this.authService.accessIsExpired()) {
                await this.authService.refeshAccess()
            }
            await axios.put<{ message: string }>(`${ENV.BACK_END_HOST}/api/product/${id}`,
                {
                    name: options.name,
                    description: options.description,
                    ...(options.categoryId !== undefined ? { categoryId: options.categoryId } : {})
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${this.authService.getAccessToken()}`
                    }
                }
            )
        } catch (error) {
            throw error
        }
    }

    /**
     * Find many product
     * @returns 
     */
    async getAll(options: {
        categoryId?: number,
        page?: number,
        limit?: number,
        include?: {
            user?: boolean,
            variants?: boolean,
            media?: boolean,
            category?: boolean
        }
    }): Promise<Product[]> {
        const result = await this.getPaginated(options)
        return result.products
    }

    /**
     * Find products with category filter and pagination (page, limit)
     */
    async getPaginated(options: {
        categoryId?: number,
        page?: number,
        limit?: number,
        include?: {
            user?: boolean,
            variants?: boolean,
            media?: boolean,
            category?: boolean
        }
    }): Promise<{ products: Product[], pagination: PaginationMeta }> {
        try {
            const params: string[] = []
            if (options?.categoryId !== undefined) {
                params.push(`categoryId=${options.categoryId}`)
            }
            if (options?.page !== undefined) {
                params.push(`page=${options.page}`)
            }
            if (options?.limit !== undefined) {
                params.push(`limit=${options.limit}`)
            }
            if (options?.include?.user) {
                params.push("include[user]=true")
            }
            if (options?.include?.variants) {
                params.push("include[variants]=true")
            }
            if (options?.include?.media) {
                params.push("include[media]=true")
            }
            if (options?.include?.category) {
                params.push("include[category]=true")
            }
            const queryString = params.length > 0 ? `?${params.join("&")}` : ""
            const response = await axios.get<GetAllProductResponse>(`${ENV.BACK_END_HOST}/api/products${queryString}`)
            const products = response.data.products || []

            const mappedProducts = products.map(p => {
                const media: Media[] = (p.media || []).map(med => ({
                    id: med.id,
                    fileName: med.fileName,
                    filePath: med.filePath,
                    media_type: med.media_type || 'IMAGE'
                }))
                const variants: Variant[] = (p.variants || []).map(v => ({
                    id: v.id,
                    name: v.name,
                    sku: v.sku,
                    productId: v.productId,
                    userId: "",
                    price: v.price,
                    stock: v.stock
                }))
                return ({
                    id: p.id,
                    name: p.name,
                    product_code: p.product_code,
                    description: p.description,
                    category: p.category,
                    media: media,
                    variants: variants,
                    createdAt: new Date(p.createdAt),
                    updatedAt: new Date(p.updatedAt)
                })
            })

            const pagination: PaginationMeta = response.data.pagination || {
                total: mappedProducts.length,
                page: options?.page || 1,
                limit: options?.limit || mappedProducts.length || 12,
                totalPages: 1
            }

            return {
                products: mappedProducts,
                pagination
            }
        } catch (error) {
            console.log(error)
            throw new Error("ProductService Error: getData")
        }
    }

    /**
     * Retrieve all categories with product counts
     */
    async getCategories(): Promise<CategoryItem[]> {
        try {
            const response = await axios.get<{ categories: CategoryItem[] }>(`${ENV.BACK_END_HOST}/api/categories`)
            return response.data.categories || []
        } catch (error) {
            console.log(error)
            return []
        }
    }

    /**
     * Delete a product by product's id
     * @param id 
     */
    async deleteById(id: string): Promise<void> {
        try {
            if (this.authService.accessIsExpired()) {
                await this.authService.refeshAccess()
            }
            const response = await axios.delete(`${ENV.BACK_END_HOST}/api/product/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${this.authService.getAccessToken()}`
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
            const product = response.data.product
            const media: Media[] = product.media.map(med => ({
                id: med.id,
                fileName: med.fileName,
                filePath: med.filePath,
                media_type: med.media_type || 'IMAGE'
            }))
            const variants: Variant[] = product.variants.map(v => ({
                id: v.id,
                name: v.name,
                sku: v.sku,
                productId: v.productId,
                userId: "",
                price: v.price,
                stock: v.stock

            }))
            return {
                id: product.id,
                name: product.name,
                product_code: product.product_code,
                description: product.description,
                category: product.category,
                media: media,
                variants: variants,
                createdAt: new Date(product.createdAt),
                updatedAt: new Date(product.updatedAt)
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.status === 404) {
                    return null
                }
            }
            throw error
        }
    }

    /**
     * Retrieve similar products by product's id (sorted from highest to lowest similarity)
     * @param id
     * @param limit
     * @returns
     */
    async getSimilarProducts(id: string, limit?: number): Promise<Product[]> {
        try {
            const query = limit ? `?limit=${limit}` : ""
            const response = await axios.get<GetSimilarProductsResponse>(
                `${ENV.BACK_END_HOST}/api/products/${id}/similar${query}`
            )
            const products = response.data.products || []

            return products.map(p => {
                const media: Media[] = (p.media || []).map(med => ({
                    id: med.id,
                    fileName: med.fileName,
                    filePath: med.filePath,
                    media_type: med.media_type || 'IMAGE'
                }))
                const variants: Variant[] = (p.variants || []).map(v => ({
                    id: v.id,
                    name: v.name,
                    sku: v.sku,
                    productId: v.productId,
                    userId: "",
                    price: v.price,
                    stock: v.stock
                }))
                return {
                    id: p.id,
                    name: p.name,
                    product_code: p.product_code,
                    description: p.description,
                    category: p.category,
                    media: media,
                    variants: variants,
                    createdAt: new Date(p.createdAt),
                    updatedAt: new Date(p.updatedAt)
                }
            })
        } catch (error) {
            console.log(error)
            return []
        }
    }

    /**
     * Lấy danh sách "Gợi ý cho bạn" theo Item-Based (từ các sản phẩm trong giỏ hàng hoặc lịch sử mua hàng).
     * Nếu người dùng chưa tương tác hoặc chưa có dữ liệu tương đồng, tự động lấy tạm từ GET /api/products.
     */
    async getRecommendedForYou(options?: {
        productIds?: string[];
        cartId?: string;
        userId?: string;
        limit?: number;
    }): Promise<Product[]> {
        const limit = options?.limit ?? 8
        try {
            const params: string[] = [`limit=${limit}`]
            if (options?.productIds && options.productIds.length > 0) {
                params.push(`productIds=${options.productIds.join(",")}`)
            }
            if (options?.cartId) {
                params.push(`cartId=${options.cartId}`)
            }
            if (options?.userId) {
                params.push(`userId=${options.userId}`)
            }

            const response = await axios.get<{ products: ProductResponse[] }>(
                `${ENV.BACK_END_HOST}/api/recommend/for-you?${params.join("&")}`
            )
            const products = response.data.products || []

            if (products.length > 0) {
                return products.map(p => {
                    const media: Media[] = (p.media || []).map(med => ({
                        id: med.id,
                        fileName: med.fileName,
                        filePath: med.filePath,
                        media_type: med.media_type || 'IMAGE'
                    }))
                    const variants: Variant[] = (p.variants || []).map(v => ({
                        id: v.id,
                        name: v.name,
                        sku: v.sku,
                        productId: v.productId,
                        userId: "",
                        price: v.price,
                        stock: v.stock
                    }))
                    return {
                        id: p.id,
                        name: p.name,
                        product_code: p.product_code,
                        description: p.description,
                        category: p.category,
                        media: media,
                        variants: variants,
                        createdAt: new Date(p.createdAt),
                        updatedAt: new Date(p.updatedAt)
                    }
                })
            }

            // Fallback: Khi chưa có dữ liệu tương tác, lấy tạm từ GET /api/products
            const fallback = await this.getPaginated({
                page: 1,
                limit,
                include: {
                    variants: true,
                    media: true,
                    category: true
                }
            })
            return fallback.products
        } catch (error) {
            console.log(error)
            try {
                const fallback = await this.getPaginated({
                    page: 1,
                    limit,
                    include: {
                        variants: true,
                        media: true,
                        category: true
                    }
                })
                return fallback.products
            } catch {
                return []
            }
        }
    }
}