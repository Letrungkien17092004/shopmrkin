import Permission from "./Permission.js"

export type RoleConstructorParam = {
    id: number
    roleName: string
    description: string | null
    permissions?: Permission[]
}

export default class Role {
    id: number
    roleName: string
    description: string | null
    permissions?: Permission[]

    constructor(options: RoleConstructorParam) {
        this.id = options.id
        this.roleName = options.roleName
        this.description = options.description
        this.permissions = options.permissions
    }
}