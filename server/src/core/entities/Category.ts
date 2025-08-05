


type CategoriesConstructorParam = {
    id: number
    name: string
    slug: string
    products?: string[]
}

export default class Category {
    id: number
    name: string
    slug: string
    products?: string[]

    constructor(options: CategoriesConstructorParam) {
        this.id = options.id
        this.name = options.name
        this.slug = options.slug
        this.products = options.products
    }
}