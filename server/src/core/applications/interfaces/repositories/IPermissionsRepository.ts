import {Permission} from "core/entities/index.js";

export default interface IPermissionsRepository {
    create(options: Permission): Promise<Permission>
    getById(id: string): Promise<Permission | null>
    update(options: Partial<Permission>): Promise<Permission>
    deleteById(id: string): Promise<boolean>
}