
export type PermisRoleConstructorParam = {
    permissionId: number
    roleId: number
}

export default class PermisRole {
    permissionId: number
    roleId: number

    constructor(options: PermisRoleConstructorParam) {
        this.permissionId = options.permissionId
        this.roleId = options.roleId
    }
}