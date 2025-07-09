import {Role, Permission} from 'core/entities/index.js'

export default interface IAdminSystemUsecase {
    createRole(attributes: Pick<Role, "roleName" | "description">): Promise<Role>
    updateRole(attributes: Omit<Partial<Role>, "id">): Promise<Role>
    createPermission(attributes: Pick<Permission, "perName" | "description">): Promise<Permission>
    updatePermission(attributes: Omit<Partial<Permission>, "id">): Promise<Permission>
    createAndLink(roleAttributes: Pick<Role, "roleName" | "description">, perAttributes: Pick<Permission, "perName" | "description">): Promise<Role>
}