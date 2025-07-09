import {Role, Permission} from 'core/entities/index.js'

export default interface IAdminSystemUsecase {
    createRole(attributes: Pick<Role, "roleName" | "description">): Promise<Role>
    updateRole(atributes: Omit<Partial<Role>, "id">): Promise<Role>
    createPermission(atributes: Pick<Permission, "perName" | "description">): Promise<Permission>
    updatePermission(attributes: Omit<Partial<Permission>, "id">): Promise<Permission>
    createAndLink(roleAttribute: Pick<Role, "roleName" | "description">, perAttribute: Pick<Permission, "perName" | "description">): Promise<Role>
}