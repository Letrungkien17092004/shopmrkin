import IAdminSystemUsecase from "../interfaces/usecases/IAdminSystemUsecase.js";
import { Role, Permission, RolePermission } from "core/entities/index.js"
import IRolesRepository from "../interfaces/repositories/IRolesRepository.js";
import IPermissionsRepository from "../interfaces/repositories/IPermissionsRepository.js";
import IRolePerRepository from "../interfaces/repositories/IRolePerRepository.js";

export default class AdminSystemUsecase implements IAdminSystemUsecase {
    private roleRepo: IRolesRepository
    private perRepo: IPermissionsRepository
    private rolePer: IRolePerRepository


    constructor(roleRepo: IRolesRepository, perRepo: IPermissionsRepository, rolePer: IRolePerRepository) {
        this.roleRepo = roleRepo
        this.perRepo = perRepo
        this.rolePer = rolePer
    }

    async createRole(attributes: Pick<Role, "roleName" | "description">): Promise<Role> {
        try {
            const newRole = await this.roleRepo.create(attributes)
            return newRole
        } catch (error) {
            throw new Error(`Error: ${error}`)
        }
    }

    async updateRole(attributes: Omit<Partial<Role>, "id"> & Pick<Role, "id">): Promise<Role> {
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

    async updatePermission(attributes: Omit<Partial<Permission>, "id"> & Pick<Role, "id">): Promise<Permission> {
        try {
            const updatedPer = await this.perRepo.update(attributes)
            return updatedPer
        } catch (error) {
            throw new Error(`Error: ${error}`)
        }
    }
    
    async createAndLink(roleAttributes: Pick<Role, "roleName" | "description">, perAttributes: Pick<Permission, "perName" | "description">): Promise<RolePermission> {
        try {
            const newRole = await this.roleRepo.create(roleAttributes)
            const newPer = await this.perRepo.create(perAttributes)
            const rolePer = await this.rolePer.create({roleId: newRole.id, permisId: newPer.id})
            return rolePer
        } catch (error) {
            throw new Error(`Error: ${error}`)
        }
    }

    async createRelationships(roleId: number, perId: number): Promise<RolePermission> {
        try {
            const rolePer = await this.rolePer.create({
                roleId: roleId, 
                permisId: perId
            })
            return rolePer
        } catch (error) {
            throw new Error(`Error: ${error}`)
        }
    }
}