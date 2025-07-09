import {Role} from "core/entities/index.js"

export default interface IRolesRepository {
    create(newRole: Partial<Role>): Promise<Role>
    getAll(): Promise<Role[]>
    getById(): Promise<Role>
    update(attributes: Omit<Partial<Role>, 'id'>): Promise<Role>
    deleteById(id: number): Promise<boolean>
    associateWithPer(roleId: number, perId: number): Promise<Role>
}