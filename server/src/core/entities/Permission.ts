
type PermissionConstructorParam = {
    id: number
    perName: string
    description: string | null
}

export default class Permission {
    id: number
    perName: string
    description: string | null

    constructor(options: PermissionConstructorParam) {
        this.id = options.id
        this.perName = options.perName
        this.description = options.description
    }
}