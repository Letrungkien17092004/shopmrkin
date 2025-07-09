
export type PermissionConstructorParam = {
    id: number
    perName: string
    description?: string
}

export default class Permission {
    id: number
    perName: string
    description?: string

    constructor(options: PermissionConstructorParam) {
        this.id = options.id
        this.perName = options.perName
        this.description = options.description
    }
}