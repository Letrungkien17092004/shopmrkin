import {Role} from "core/entities/index.js"

export default interface IRolesRepository {
    create(newRole: Partial<Role>): Promise<Role>
    getAll(): Promise<Role[]>
    getById(id: number): Promise<Role | null>
    update(attributes: Omit<Partial<Role>, "id"> & Pick<Role, "id">): Promise<Role>
    deleteById(id: number): Promise<boolean>
}