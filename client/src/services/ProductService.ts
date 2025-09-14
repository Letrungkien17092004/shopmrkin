import VariantService, { Variant } from "./VariantService.ts"

const variantService = new VariantService()

export type ProductConstructorParam = {
    id: string,
    productName: string,
    description: string,
    category: string,
    imgUrl: string,
    variants: Variant[],
    createdAt: Date,
    updatedAt: Date
}

export class Product {
    id: string
    productName: string
    description: string
    category: string
    imgUrl: string
    variants: Variant[]
    createdAt: Date
    updatedAt: Date

    constructor(options: ProductConstructorParam) {
        this.id = options.id
        this.productName = options.productName
        this.description = options.description
        this.category = options.category
        this.imgUrl = options.imgUrl
        this.variants = options.variants
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

const demoImage = "data:image/png;base64,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"
let demoProductData: Product[] = [
    new Product({
        id: "00001",
        productName: "Product 1",
        description: "Description 1",
        category: "category 1",
        imgUrl: demoImage,
        variants: [],
        createdAt: new Date(2025, 8, 10),
        updatedAt: new Date(2025, 8, 10),
    }),
    new Product({
        id: "00002",
        productName: "Product 2",
        description: "Description 2",
        category: "category 2",
        imgUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAA9lBMVEX////M9f0AAAAz2Pj/b5WYmJjR/P/j4+N1jJHO+P814P8OO0TV//+z1t0tvdnQ+v+qzNNTY2fF7fV6k5cV1fju+/5/mZ6cu8FleX0tNjipy9LD6vKiw8khKCm12eBYam1sgoaXtrvt7e2mpqaPrLKIpKlLWl3GxsYtLS0NEBC74eg8SEpgc3cxOz0WGxtEUlQ/Pz+3t7dtbW0VGBmEOU3oZYjYXn5VJTLDVXJDHSekR2ApKSk25v/a2toikaYwzesoqcKOjo5cXFx6enpzMkNkLDoiDxS0Tmk0Fx8aCw+VQVcLLzURSVNISEgabn4XYW8mo7sHHiNctXwVAAAMkElEQVR4nO1df2PaNhOOPXAxMRGBdyYESEKwkwIBumbJsnZJunRru6Xptu//ZV7AWHf6YWyDGTLT8x/ClvVY0t1zJ9ne29PQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDYOs4ve8V8oHd5np7e5cfXZp4w/niZil/x/bZbvALeFxP3ZG/bbV0ZvUT8zt9su51r4E2CbrzcdiPXROx0/GHbLVwbP+w6wRiK99tuXSa4jyZ4zjiJ/pXbruQBbfeqjxv+PtrcvEWHdbqGRYidBxBiGd0OavvbKILYjPoWMfIEYvmo9VEGFXRav+psu8mp4VRgqL6O7cKTfHVgAHIS14lP9P92HglOKbYpgyepIaV/n+VviAZwzigHmTkFZ1+zt93UFWHXKAeZ26eu4szadktXhkU7UeYwXqiZyWsXTjuxEpJ4kUxDamvzOgtncEIS1+JEfBX+N8nvIJ0O00lI41U0w6NcMzxKwLCUa4YlzfA/yZAAlrgRm7CIPEisY3nF9Fw7tg3GSgyJ0Xbrc7h+Y1CLiqnIwK9jdGuSA0mr63oD/ga2unWhUKBn2YOK57uu1x60rCUs0zMklaaJ0DlsGDKOpGRyGIvqnQQRXN1mC+d+uLSsawipng1RG7yBE3V4eoa1Md/0ji/eQuLyR5miNCJhiFpC3C1vURgtFQnxm3zdpycRHFMzJHVJ0zsVvnuI5Cjzij3KbtF/KtA6kMpVeZNt0pVVbh7KB3ZqhtaptHqPa3xFdlCTuwuQZYArEI8WyjuRtC6kLRAbsSJDciiv3WW0q12VHTPirk3VhtmhZztQ/4WsD61jYZYAjmzxlMwYmh6+43KGXKc4I/irRZsGGbK+jGAjmt8UE0OgmB1DE89FKcPrFnt5B/3XJZITW2JzlxM0zeEmGeJZJmM45MyRPUB/ni4uQXAGsCHYL+n0ZnDKn7MGw26j617hyl04DBhetBsBTvgBhLJEU2e5aJiFb6DLtdau4STvdEyWvK7nHrET0+fs0xoMZ9rKMrDzqEkYHjlR+o7prtA1tK5R2RXfWHxD+37NsmYVW1aVse+c112DYcDHQQMH7jliGOm3LXYAEPa8GTpsboHp9BJSUrZTRUaLi9fXZojnxjVtURKGDsiuKS7mx1msnmBHKUEntNlqiYG6kVWH6zM00PLAcThAkjA0mEkVGFoywWVY6rBdWOFrtQlQHDJdnwFDwx4KByZgaKOM+/zuzO88W9bFveGAlmlLKrXh5jByLwuGILRG4d1LwvCYZTO7COHcXR27WFCx0jqR82GURSZ9SK/dbyVnyJrSwFdbXMh1gcYb6O2+qARmcOjJjDrMgiGyGeH4wN4iXLPkGoRUaYBpux3W35lNqeSPCKtQAh87jEwYQiVtUXz1Awx93uHzIYJHGJUzP3cAJxHqECKiKjRR8fzNhCFMRF8mLxe4YNvD6ZOZfxcDPyBjt6h0iR/3pcwZNvgjpcqbEWHIcIRwWA0wA0R8YHqHUWsMYLvw5M+EIVR9towhYwB4U2rOghMhNwFNhZg62sPSm3aVOUPBckoZjlsGqscX/vf5aRgqHbbG6PwNNTWnWY/SVfoQ1vVohRd0GlKT0QGXFN+H9ub6MOk8ZJKSVIJQMdakxDxqN6kxTTIP6UWzZ5jMlrJZ0bC4b/BGdcqL+srjcLxt15aC8xb94bgZYML5QzpnhjBeQ1xDiAH2d6v+0KE2sCJqGrs2B6dpIFA4dYTcyxUUwaRDmkY+TDeoacAIjGlRnC6FgT2tnGfoWdSqQmZpm7oU6pgkji1gaDYIFxTOzAtMOiRqzKV1ov1PWccWqDk+tQtxDEGsV2x+oWCEgz1Qpig+bMgq3Vx8iCzFIHGM74T7PKaxPb8EMD0F9BsYDRzjnwi1OhDjj5g/12fogFyeJM7TQBTRdAQR3iDI8CMxuzRPg7KQmeVp5hrMxlnoduJcG/THLMjlVnumIwFU0iGcT7CULdUsmKLWhnJthBBngOJYlFGPy5eCKZ0lKtB6kxmkQkDBjHGYj2OPjt8Kqt5cvtT3vDqTEDxGGUzIeTe6ASoWdlL0xszmGZuUCq5GBy643anHY9Pbw7rX9fwrdoxnmPPmgcejTLWN0CZchxq+uUawcNg0H+twADaMhMvPScDnyTNkyCx/SpU3zklQSvMiRrhxJUxG0WqbyzHZ4NrTANcdsX5I3SU1pUGaHGcRg9ABFAwbDvL5Rp7g5tYP++zSmSSCN5GaAg8Ymko4aLGAQSu4YFWoVe2bkchkDVhIAgZtH6Rax4e/FzlftIYRzrvw94TT2aQWvY4vk+Tp+9CTVH0kDI7lezHsVtgRCxcKtYZ3gcYrdcJVbZOuGFHOas9oL4aYBTQnwl6TiP00sNASXpa6ULr2EaoGqgkkW8yJ4V3zdZ+eROyLSs/QHoxwzc2SfDuSuCfqGiutwFZOaPPtYHlsDMcEO4c68uc8iFM9Aw8zvvBqGe6JMmy77bqu7089frs6sKyIqq0Tz8VosPvarIrnH+PbPi1w23gDmTXosgUMbMsZVBue63vtiuEseRpkzb2JEtsFbVi+N9HmF75t/hihgK9hU3sTcwbNUDNUH5qhZrgpLHND6aAmQ2KdVLJ66lhJhoEOd2Wb+9NDRYbhJquxH6nZ0tSmHkMIrcymt1y3JYGCDJktiM3GuvNRRYZsjD1sr9ePKjLk9zBcVCODvwRQkaGYHjiMeiAmAVRkKHsq53QQFWnHQUGG/AbFBc5aq7VCRYbCzoUA/XptlXaoyFCakZ1zdO30ZlVFhnQN7UeRo5da5ijNsHAjchx1U7pHBRnCrvtCoXDzm8ixncp1qMiQrksUZrj5XeA4rKZwHQoyhJ0mhQC3PwkcDytJHvaeQ0GGBl2HKoS4+1ngeJVU5qjIMFyQ+KMAuPskcDxL5h5VZBgubn0qYHwWOZaSZAEUZFgLV86+FFi8+0PgyD/iIIGKDMPL/lzg8U4cqrG9qDLDnwSGhYIgAaK201KozPB3CcPCLTcdS3GdmDOGt4L7j30NmYIM6U7Z3wSCfwrzUHgaWoB6DGE3kcDwTiQoeWafg4IM6V6bH3mGokJN8D5HBRnSDWMCwy8cvU5pEO/y1WMICeE/eYasAr9qG0lCDAUZNiIZfgZ6E2/pFhMEBRnSXYnvBFsKw/Q48YsOFWToRTMEYzqKr2gBBRnSpP7nmYu/jZiJ/GbnSCjIkCb17wKljafjDczEWEe4gNIMFzIbew1Q3kcJZ6KCDOmyBdXYeKRCJyZ8bax6DCXLFjhQBI+R8K2qCjKULFt8RhQhKdVN5BAVZCg8lM9mbMBjNOMrM5RkKHsYANtT0N9uknapx9Dhn7ec42Zlj6Egw5EpAY73IQ4+TeAxFGQovDpiDuwxIFVTzWP05Mjfiyj3GMNcMkS0OhV4PgbrcPAY0tddMlCa4ahlwdNFeBXjFu5BLa4+9RjCI7Onhm04sKiP5SmsmwoPDQn1KceQPlBan18VXpSAPQZKK+Yv12aQ9mxvYr8beAK0B4xm+e9wSioura8gw/nbrrstOvrAP94Fk5BNSFVyyJB9YznajPmFjRAD5G8eCkBvFn4nrq/FuoscMERvcfskrOev5w/Pw7/qznYh26w4x5mR5mz8jZKi8Iimmljy0HMUroszgnn+KGc8XqY9uO02bBjFvTx+FzcNXu9tuwUbx94K8zdX6O8teTX/TmC846bUNN/AB+We93cJzyGtt+AtHn4p7w5+eQhp9eDbnF+/2yV8DWldok9XHmy7VRnigLI6R989/FbedrsyQ/lbSGr2HUSQbY/bblhmeKScijgwNP/alU4s/0U5zcPEJ/rz792gWP6bMgq+mgtfOu7vxjg9ACW6+PIxtTXm8y5QfKTenn5v9d7cJYqIoHkf5jE+Qtk/B/mei+WDf4DMR0jVwFfVp+pt241cCw+ICf7COhqnprn/oZzPfiyXP+xjIveIIfoo93w2Pjx+lzOW0+Y+PjwzLLhPc/MJqf1vDx8O1ofQkoiydfHh4ds+x6DIZ4R/NTeB6YjHXB5nkv8rY6+5kZUZfhVy3nu9jVyIiVgWcrHPdOBmLtsTCWJtkyVQ2EkVP45ivi49e1Vcygju7Z2/xJ+aHo//C1EOXdVzmZY9Lj13RbyIyzKbHKnfU9Ds83so+34DV5SO0M0ZnPeo8qdF2VtUlnnOXWJiuKHayza/iG9oKCywK8522LzpnfOEZLgvPmV2SfaOBsKCdcXZjZqnIqNiYvDqslfMAPyUP+8Vhbv8KosL9S6jrYuGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhobGv4P/A72S3cOgdUZgAAAAAElFTkSuQmCC",
        variants: [],
        createdAt: new Date(2025, 8, 10),
        updatedAt: new Date(2025, 8, 10),
    }),
    new Product({
        id: "00003",
        productName: "Product 3",
        description: "Description 3",
        category: "category 2",
        imgUrl: "data:image/png;base64,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",
        variants: [],
        createdAt: new Date(2025, 8, 10),
        updatedAt: new Date(2025, 8, 10),
    }),
]

export default class ProductService {
    async create(options: Omit<Product, "id" | "variants" | "createdAt" | "updatedAt" | "stock" | "minPrice" | "maxPrice">): Promise<Product> {
        try {
            const newProduct = new Product({
                id: `${parseInt(`${Math.random() * 10000}`)}`,
                productName: options.productName,
                description: options.description,
                category: options.category,
                imgUrl: demoImage,
                variants: [],
                createdAt: new Date(Date.now()),
                updatedAt: new Date(Date.now())

            })
            demoProductData.push(newProduct)
            return newProduct
        } catch (error) {
            throw new Error("ProductService Error: createData")
        }
    }

    async updateById(id: string, options: Partial<Omit<Product, "id" | "variants">>): Promise<Product> {
        try {
            const prod = demoProductData.find(p => p.id === id)
            if (!prod) {throw new Error("not found")}
            prod.productName = options.productName || prod.productName
            prod.description = options.description || prod.description
            prod.category = options.category || prod.category
            prod.updatedAt = new Date(Date.now())

            return prod
        } catch (error) {
            throw error
        }
    }
    async getAll(): Promise<Product[]> {
        try {
            for(let i=0; i<demoProductData.length; i++) {
                const prod = demoProductData[i]!
                prod.variants = await variantService.getManyByProductId(prod.id)
            }
            return demoProductData
        } catch (error) {
            throw new Error("ProductService Error: getData")
        }
    }

    async deleteById(id: string): Promise<void> {
        try {
            const originLength = demoProductData.length
            demoProductData = demoProductData.filter(p => p.id !== id)
            if (demoProductData.length == originLength) throw new Error("not found")

        } catch (error) {
            throw error
        }
    }

    async findById(id: string): Promise<Product | null> {
        const prod = demoProductData.find(prod => prod.id === id)
        if (prod) {
            const variants = await variantService.getManyByProductId(prod.id)
            prod.variants = variants
            return prod
        }
        return null
    }
}