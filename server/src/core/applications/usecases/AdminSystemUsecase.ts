import IAdminSystemUsecase from "../interfaces/usecases/IAdminSystemUsecase.js";
import { Role, Permission, RolePermission } from "core/entities/index.js"
import IRolesRepository from "../interfaces/repositories/IRolesRepository.js";
import IPermissionsRepository from "../interfaces/repositories/IPermissionsRepository.js";
import IRolePerRepository from "../interfaces/repositories/IRolePerRepository.js";
import { REPO_ERROR, REPO_ERROR_CODE } from "../interfaces/repositories/errors.js";
import { USECASE_ERROR, USECASE_ERROR_CODE } from "../interfaces/usecases/errors.js";

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
            if (error instanceof REPO_ERROR) {
                switch (error.code) {
                    case REPO_ERROR_CODE.UNIQUE_CONSTRAINT:
                        throw new USECASE_ERROR({
                            message: "role already exist",
                            code: USECASE_ERROR_CODE.EXISTED
                        })
                    case REPO_ERROR_CODE.UNKNOW:
                        throw new USECASE_ERROR({
                            message: "something wrong with repo",
                            code: USECASE_ERROR_CODE.UNKNOW
                        })
                }
            }
            throw new USECASE_ERROR({
                message: "Unable to determine the cause",
                code: USECASE_ERROR_CODE.UNKNOW
            })
        }
    }

    async getRoleById(id: number): Promise<Role | null> {
        try {
            const role = await this.roleRepo.getById(id)
            return role
        } catch (error) {
            if (error instanceof REPO_ERROR) {
                switch (error.code) {
                    case REPO_ERROR_CODE.NOTFOUND:
                        throw new USECASE_ERROR({
                            message: "role not found",
                            code: USECASE_ERROR_CODE.NOTFOUND
                        })
                }
            }
            throw new USECASE_ERROR({
                message: "Unable to determine the cause",
                code: USECASE_ERROR_CODE.UNKNOW
            })
        }
    }

    async updateRole(attributes: Omit<Partial<Role>, "id"> & Pick<Role, "id">): Promise<Role> {
        try {
            const updatedRole = await this.roleRepo.update(attributes)
            return updatedRole
        } catch (error) {
            if (error instanceof REPO_ERROR) {
                switch (error.code) {
                    case REPO_ERROR_CODE.NOTFOUND:
                        throw new USECASE_ERROR({
                            message: "role not found",
                            code: USECASE_ERROR_CODE.NOTFOUND
                        })
                    case REPO_ERROR_CODE.UNIQUE_CONSTRAINT:
                        throw new USECASE_ERROR({
                            message: "role already exist",
                            code: USECASE_ERROR_CODE.EXISTED
                        })
                }
            }
            throw new USECASE_ERROR({
                message: "Unable to determine the cause",
                code: USECASE_ERROR_CODE.UNKNOW
            })
        }
    }

    async createPermission(attributes: Pick<Permission, "perName" | "description">): Promise<Permission> {
        try {
            const newPer = await this.perRepo.create(attributes)
            return newPer
        } catch (error) {
            if (error instanceof REPO_ERROR) {
                switch (error.code) {
                    case REPO_ERROR_CODE.UNIQUE_CONSTRAINT:
                        throw new USECASE_ERROR({
                            message: "permission already exist",
                            code: USECASE_ERROR_CODE.EXISTED
                        })
                }
            }
            throw new USECASE_ERROR({
                message: "Unable to determine the cause",
                code: USECASE_ERROR_CODE.UNKNOW
            })
        }
    }

    async updatePermission(attributes: Omit<Partial<Permission>, "id"> & Pick<Role, "id">): Promise<Permission> {
        try {
            const updatedPer = await this.perRepo.update(attributes)
            return updatedPer
        } catch (error) {
            if (error instanceof REPO_ERROR) {
                switch (error.code) {
                    case REPO_ERROR_CODE.NOTFOUND:
                        throw new USECASE_ERROR({
                            message: "permission not found",
                            code: USECASE_ERROR_CODE.NOTFOUND
                        })
                    case REPO_ERROR_CODE.UNIQUE_CONSTRAINT:
                        throw new USECASE_ERROR({
                            message: "permission already exist",
                            code: USECASE_ERROR_CODE.EXISTED
                        })
                }
            }
            throw new USECASE_ERROR({
                message: "Unable to determine the cause",
                code: USECASE_ERROR_CODE.UNKNOW
            })
        }
    }

    async createAndLink(roleAttributes: Pick<Role, "roleName" | "description">, perAttributes: Pick<Permission, "perName" | "description">): Promise<RolePermission> {
        try {
            const newRole = await this.roleRepo.create(roleAttributes)
            const newPer = await this.perRepo.create(perAttributes)
            const rolePer = await this.rolePer.create({ roleId: newRole.id, permisId: newPer.id })
            return rolePer
        } catch (error) {
            if (error instanceof REPO_ERROR) {
                switch (error.code) {
                    case REPO_ERROR_CODE.UNIQUE_CONSTRAINT:
                        throw new USECASE_ERROR({
                            message: "resoucre already exist",
                            code: USECASE_ERROR_CODE.EXISTED
                        })
                }
            }
            throw new USECASE_ERROR({
                message: "Unable to determine the cause",
                code: USECASE_ERROR_CODE.UNKNOW
            })
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
            if (error instanceof REPO_ERROR) {
                switch (error.code) {
                    case REPO_ERROR_CODE.UNIQUE_CONSTRAINT:
                        throw new USECASE_ERROR({
                            message: "resoucre already exist",
                            code: USECASE_ERROR_CODE.EXISTED
                        })
                }
            }
            throw new USECASE_ERROR({
                message: "Unable to determine the cause",
                code: USECASE_ERROR_CODE.UNKNOW
            })
        }
    }
}