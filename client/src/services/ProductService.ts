
export type Product = {
    id: string,
    productName: string,
    description: string,
    category: string,
    minPrice: number,
    maxPrice: number,
    stock: number,
    imgUrl: string,
    createdAt: Date,
    updatedAt: Date
}


let demoProductData: Product[] = [
    {
        id: "fa6cd774-96e7-4fd8-bcd6-d11ca39fe8d3",
        productName: "Áo thun",
        description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsam, omnis? Quam, doloribus eveniet quae veritatis provident delectus a explicabo cum eum libero voluptatum reiciendis. Ab dolore maxime illum suscipit nihil.",
        category: "Thời trang",
        minPrice: 100000,
        maxPrice: 199000,
        stock: 50,
        imgUrl: "/public/image/van_hi.jpg",
        createdAt: new Date(2025, 8, 1),
        updatedAt: new Date(2025, 8, 1)
    },
    {
        id: "fa6cd774-96e7-5fd8-bcd6-d11ca39fe8d2",
        productName: "Áo ba lỗ",
        description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsam, omnis? Quam, doloribus eveniet quae veritatis provident delectus a explicabo cum eum libero voluptatum reiciendis. Ab dolore maxime illum suscipit nihil.",
        category: "Thời trang",
        minPrice: 50000,
        maxPrice: 50000,
        stock: 20,
        imgUrl: "/public/image/van_hi.jpg",
        createdAt: new Date(2025, 8, 1),
        updatedAt: new Date(2025, 8, 1)
    },
    {
        id: "fa6cd774-96e7-2fd8-bcd6-d11ca39fe8d2",
        productName: "Quần dài",
        description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsam, omnis? Quam, doloribus eveniet quae veritatis provident delectus a explicabo cum eum libero voluptatum reiciendis. Ab dolore maxime illum suscipit nihil.",
        category: "Thời trang",
        minPrice: 200000,
        maxPrice: 399000,
        stock: 1000,
        imgUrl: "/public/image/van_hi.jpg",
        createdAt: new Date(2025, 8, 1),
        updatedAt: new Date(2025, 8, 1)
    },
    {
        id: "fa6cd773-96e7-4fd8-bcd6-d11ca39fe8d2",
        productName: "Áo hoody",
        description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsam, omnis? Quam, doloribus eveniet quae veritatis provident delectus a explicabo cum eum libero voluptatum reiciendis. Ab dolore maxime illum suscipit nihil.",
        category: "Thời trang",
        minPrice: 100000,
        maxPrice: 199000,
        stock: 100000,
        imgUrl: "/public/image/van_hi.jpg",
        createdAt: new Date(2025, 8, 1),
        updatedAt: new Date(2025, 8, 1)
    },
    {
        id: "fa6cd774-96e0-4fd8-bcd6-d11ca39fe8d2",
        productName: "Giày thể thao nam",
        description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsam, omnis? Quam, doloribus eveniet quae veritatis provident delectus a explicabo cum eum libero voluptatum reiciendis. Ab dolore maxime illum suscipit nihil.",
        category: "Thời trang",
        minPrice: 899000,
        maxPrice: 999999,
        stock: 123000,
        imgUrl: "/public/image/van_hi.jpg",
        createdAt: new Date(2025, 8, 1),
        updatedAt: new Date(2025, 8, 1)
    }

]

export default class ProductService {


    async getData(): Promise<Product[]> {
        try {
            const result: Product[] = demoProductData
            return result
        } catch (error) {
            throw new Error("ProductService Error: getData")
        }
    }

    async deleteById(id: string): Promise<void> {
        try {
            const originLength = demoProductData.length
            demoProductData = demoProductData.filter(prod => prod.id !== id)
            if (originLength == demoProductData.length) {
                throw new Error("not found")
            }

        } catch (error) {
            throw error
        }
    }

    async findById(id: string): Promise<Product | null> {
        throw new Error("No code!")
    }
}