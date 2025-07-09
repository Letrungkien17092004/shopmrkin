import {Permission} from "core/entities/index.js";

export default interface IPermissionsRepository {
    create(options: Omit<Permission, "id">): Promise<Permission>
    getById(id: string): Promise<Permission | null>
    update(options: Omit<Partial<Permission>, "id">): Promise<Permission>
    deleteById(id: string): Promise<boolean>
}