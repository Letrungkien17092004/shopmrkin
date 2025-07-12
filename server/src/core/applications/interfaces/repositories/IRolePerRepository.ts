import RolePermission from "core/entities/RolePermission.js";



export default interface IRolePerRepository {
    create(attributes: Pick<RolePermission, "roleId" | "permisId">): Promise<RolePermission>
    deleteWithPair(attributes: Pick<RolePermission, "roleId" | "permisId">): Promise<boolean>
}
