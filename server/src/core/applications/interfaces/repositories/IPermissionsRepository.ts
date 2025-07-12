import {Permission} from "core/entities/index.js";

export default interface IPermissionsRepository {
    create(options: Omit<Permission, "id">): Promise<Permission>
    getById(id: number): Promise<Permission | null>
    update(options: Omit<Partial<Permission>, "id"> & Pick<Permission, "id">): Promise<Permission>
    deleteById(id: number): Promise<boolean>
}