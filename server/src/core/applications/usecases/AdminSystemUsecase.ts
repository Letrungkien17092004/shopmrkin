import IAdminSystemUsecase from "../interfaces/usecases/IAdminSystemUsecase.js";
import { Role, Permission } from "core/entities/index.js"
import IRolesRepository from "../interfaces/repositories/IRolesRepository.js";
import IPermissionsRepository from "../interfaces/repositories/IPermissionsRepository.js";

export default class AdminSystemUsecase implements IAdminSystemUsecase {
    private roleRepo: IRolesRepository
    private perRepo: IPermissionsRepository

    constructor(roleRepo: IRolesRepository, perRepo: IPermissionsRepository) {
        this.roleRepo = roleRepo
        this.perRepo = perRepo
    }

    async createRole(attributes: Pick<Role, "roleName" | "description">): Promise<Role> {
        try {
            const newRole = await this.roleRepo.create(attributes)
            return newRole
        } catch (error) {
            throw new Error(`Error: ${error}`)
        }
    }

    async updateRole(attributes: Omit<Partial<Role>, "id">): Promise<Role> {
         try {
            const updatedRole = await this.roleRepo.update(attributes)
            return updatedRole
         } catch (error) {
            throw new Error(`Error: ${error}`)
         }
    }

    async createPermission(attributes: Pick<Permission, "perName" | "description">): Promise<Permission> {
        try {
            const newPer = await this.perRepo.create(attributes)
            return newPer
        } catch (error) {
            throw new Error(`Error: ${error}`)
        }
    }

    async updatePermission(attributes: Omit<Partial<Permission>, "id">): Promise<Permission> {
        try {
            const updatedPer = await this.perRepo.update(attributes)
            return updatedPer
        } catch (error) {
            throw new Error(`Error: ${error}`)
        }
    }
    
    async createAndLink(roleAttributes: Pick<Role, "roleName" | "description">, perAttributes: Pick<Permission, "perName" | "description">): Promise<Role> {
        try {
            const newRole = await this.roleRepo.create(roleAttributes)
            const newPer = await this.perRepo.create(perAttributes)
            const associatedRole = await this.roleRepo.associateWithPer(newRole.id, newPer.id)
            return associatedRole
        } catch (error) {
            throw new Error(`Error: ${error}`)
        }
    }
}