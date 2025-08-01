import UserUsecase from "core/applications/usecases/UserUsecase.js";
import AdminSystemUsecase from "core/applications/usecases/AdminSystemUsecase";
import RolesRepository from "repositories/RolesRepository.js";
import PermissionsRepository from "repositories/PermissionsRepository.js";
import RolePerRepository from "repositories/RolePerRepository.js";
import UserRepository from "repositories/UserRepository.js";

async function main() {
    // initial Admin usecase
    const roleRepo = new RolesRepository()
    const perRepo = new PermissionsRepository()
    const rolePerRepo = new RolePerRepository()
    const adminSystemUsecase = new AdminSystemUsecase(roleRepo, perRepo, rolePerRepo)

    // initial User usecase
    const userRepo = new UserRepository()
    const userUsecase = new UserUsecase(userRepo)

    // const adminRole = await adminSystemUsecase.createRole({
    //     roleName: "admin",
    //     description: "can do anything"
    // })

    // ==== Create new user ====
    // try {
    //     const createdUser = await userUsecase.create({
    //         username: "Mr kin 001",
    //         account: "admin01@gmail23.com",
    //         password_hash: "12345678",
    //         email: "admin01@gmail.com"
    //     })

    //     console.table(createdUser)
    // } catch (error) {
    //     console.log(error)
    // }

    // ==== find user ====
    const userA = await userUsecase.getById(3)
    console.log(userA)
}

main()