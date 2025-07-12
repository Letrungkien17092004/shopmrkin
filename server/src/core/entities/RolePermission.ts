import Role from "./Role.js"
import Permission from "./Permission.js"

export type RolePermissionParam = {
    roleId: number,
    permisId: number
    role?: Role
    permission?: Permission
}

export default class RolePermission {
    roleId: number
    permisId: number
    role?: Role
    permission?: Permission

    constructor(options: RolePermissionParam) {
        this.roleId = options.roleId
        this.permisId = options.permisId
        this.role = options.role
        this.permission = options.permission
    }
}