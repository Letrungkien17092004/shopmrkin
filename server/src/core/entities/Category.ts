


type CategoriesConstructorParam = {
    id: String
    name: String
    slug: String
    products?: String[]
}

export default class Category {
    id: String
    name: String
    slug: String
    products?: String[]

    constructor(options: CategoriesConstructorParam) {
        this.id = options.id
        this.name = options.name
        this.slug = options.slug
        this.products = options.products
    }
}