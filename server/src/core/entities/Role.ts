

type RoleConstructorParam = {
    id: number
    roleName: string
    description: string | null

}

export default class Role {
    id: number
    roleName: string
    description: string | null

    constructor(options: RoleConstructorParam) {
        this.id = options.id
        this.roleName = options.roleName
        this.description = options.description
    }
}