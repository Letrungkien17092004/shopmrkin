import {Role, Permission, RolePermission} from 'core/entities/index.js'

export default interface IAdminSystemUsecase {
    createRole(attributes: Pick<Role, "roleName" | "description">): Promise<Role>
    updateRole(attributes: Omit<Partial<Role>, "id"> & Pick<Role, "id">): Promise<Role>
    createPermission(attributes: Pick<Permission, "perName" | "description">): Promise<Permission>
    updatePermission(attributes: Omit<Partial<Permission>, "id"> & Pick<Role, "id">): Promise<Permission>
    createAndLink(roleAttributes: Pick<Role, "roleName" | "description">, perAttributes: Pick<Permission, "perName" | "description">): Promise<RolePermission>
    createRelationships(roleId: number, perId: number): Promise<RolePermission>
}