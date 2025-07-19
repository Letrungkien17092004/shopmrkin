import AdminSystemUsecase from "core/applications/usecases/AdminSystemUsecase.js";
import RolesRepository from "repositories/RolesRepository.js";
import PermissionsRepository from "repositories/PermissionsRepository.js";
import RolePerRepository from "repositories/RolePerRepository.js";
import { Role, Permission } from "core/entities/index.js"
import { USECASE_ERROR, USECASE_ERROR_CODE } from "core/applications/interfaces/usecases/errors.js";

const roleRepo = new RolesRepository()
const perRepo = new PermissionsRepository()
const rolePerRepo = new RolePerRepository()
const adminSystem = new AdminSystemUsecase(roleRepo, perRepo, rolePerRepo)

/**
 * Test Role
 * @remarks test create, read, update, delete
 */
async function testRole() {
    const rawRoles: Pick<Role, "roleName" | "description">[] = [
        {
            roleName: "admin",
            description: "do anything"
        },
        {
            roleName: "customer",
            description: "buy items",
        },
        {
            roleName: "manager",
            description: "add items, remove items,..."
        }
    ]

    // ==== Create section ====
    const roles = []
    console.log("========== CREATE ROLE ============")
    for (let i = 0; i < rawRoles.length; i++) {
        roles.push(await adminSystem.createRole({
            roleName: rawRoles[i].roleName,
            description: rawRoles[i].description,
        }))
    }

    // log result
    console.table(roles)

    // loop for check values
    let createOk = true
    for (let i = 0; i < roles.length; i++) {
        const condition = (
            typeof roles[i].id == "number" ||
            roles[i].roleName == rawRoles[i].roleName ||
            roles[i].description == rawRoles[i].description
        )

        if (!condition) {
            createOk = false
            console.log("value is not match at: testRole - create")
        }
    }

    // ==== Create when existed section ====
    let createExistedOk = true
    try {
        const role = await adminSystem.createRole({
            roleName: rawRoles[0].roleName,
            description: rawRoles[0].description
        })
        console.log("there isn't error occurred in case must be error: Create role when exixted")
        createExistedOk = false
    } catch (error) {
        if (error instanceof USECASE_ERROR) {
            if (error.code != USECASE_ERROR_CODE.EXIST) {
                createExistedOk = false
            }
        } else {
            console.log("it throws a undefined error object: Create role when exixted")
            createExistedOk = false
        }

    }

    // ==== Update section ====
    let updateOk = true
    const newData: Role = {
        id: 1,
        roleName: "new Role name",
        description: ""
    }
    const updatedRole = await adminSystem.updateRole({
        id: newData.id,
        roleName: newData.roleName
    })

    if (updatedRole.roleName != newData.roleName || updatedRole.id != newData.id) {
        updateOk = false
    }

    // ==== Update existed ====
    let updateExistedOk = true
    try {
        const updatedResult = await adminSystem.updateRole({
            id: 1,
            roleName: "customer"
        })
        updateExistedOk = false;
        console.log("there isn't error occurred in case must be error: Update existed")
    } catch (error) {
        if (error instanceof USECASE_ERROR) {
            if (error.code != USECASE_ERROR_CODE.EXIST) {
                updateExistedOk = false
            }
        } else {
            updateExistedOk = false
            console.log("it throws a undefined error object: Create role when exixted")
        }
    }

    // ==== Find section ====
    let findOK = true
    const getRole = await adminSystem.getRoleById(1)
    if (getRole) {
        if (getRole.id != 1 || getRole.roleName != "new Role name") {
            console.log("data does not match: Find section")
            findOK = false
        }
    } else {
        console.log("received null, but expected a object: Find section")
        findOK = false
    }

    // ==== Find not exist ====
    let findNotExistOk = true
    const findRoleNotExist = await adminSystem.getRoleById(10)
    if (findRoleNotExist != null) {
        findNotExistOk = false
    }

    console.log("==== Result Role test ====")
    console.log("create: " + (createOk && "✅"))
    console.log("Create when existed: " + (createExistedOk && "✅"))
    console.log("Update: " + (updateOk && "✅"))
    console.log("Update existed: " + (updateExistedOk && "✅"))
    console.log("Find: " + (findOK && "✅"))
    console.log("Find not exist: " + (findNotExistOk && "✅"))
}


/**
 * Test Permission
 * @remarks test create, read, update, delete
 */
async function testPermission() {
    const rawPers: Pick<Permission, "perName" | "description">[] = [
        {
            perName: "create admin",
            description: ""
        },
        {
            perName: "delete admin",
            description: ""
        },
        {
            perName: "create products",
            description: ""
        },
        {
            perName: "modify products",
            description: ""
        },
        {
            perName: "read products",
            description: ""
        },
        {
            perName: "delete products",
            description: ""
        }
    ]

    // ==== Create section ====
    const pers = []
    console.log("========== CREATE ROLE ============")
    for (let i = 0; i < rawPers.length; i++) {
        pers.push(await adminSystem.createPermission({
            perName: rawPers[i].perName,
            description: rawPers[i].description || "",
        }))
    }

    // log result
    console.table(pers)

    // loop for check values
    let createOk = true
    for (let i = 0; i < pers.length; i++) {
        const condition = (
            typeof pers[i].id == "number" ||
            pers[i].perName == rawPers[i].perName ||
            pers[i].description == rawPers[i].description
        )

        if (!condition) {
            createOk = false
            console.log("value is not match at: Create permission")
        }
    }

    // ==== Create when existed section ====
    let createExistedOk = true
    try {
        const per = await adminSystem.createPermission({
            perName: rawPers[0].perName,
            description: rawPers[0].description || ""
        })
        console.log("there isn't error occurred in case must be error: Create permission when exixted")
        createExistedOk = false
    } catch (error) {
        if (error instanceof USECASE_ERROR) {
            if (error.code != USECASE_ERROR_CODE.EXIST) {
                createExistedOk = false
            }
        } else {
            console.log("it throws a undefined error object: Create permission when exixted")
            createExistedOk = false
        }

    }

    // ==== Update section ====
    let updateOk = true
    const newData: Permission = {
        id: 1,
        perName: "new per name",
        description: ""
    }
    const updatedPer = await adminSystem.updatePermission({
        id: newData.id,
        perName: newData.perName 
    })

    if (updatedPer.perName != newData.perName || updatedPer.id != newData.id) {
        updateOk = false
    }

    // ==== Update existed ====
    let updateExistedOk = true
    try {
        const updatedResult = await adminSystem.updatePermission({
            id: 1,
            perName: "modify products"
        })
        updateExistedOk = false;
        console.log("there isn't error occurred in case must be error: Update existed")
    } catch (error) {
        if (error instanceof USECASE_ERROR) {
            if (error.code != USECASE_ERROR_CODE.EXIST) {
                updateExistedOk = false
            }
        } else {
            updateExistedOk = false
            console.log("it throws a undefined error object: Update per when exixted")
        }
    }

    // ==== Find section ====
    // let findOK = true
    // const getPer = await adminSystem.(1)
    // if (getPer) {
    //     if (getPer.id != 1 || getPer.roleName != "new Role name") {
    //         console.log("data does not match: Find section")
    //         findOK = false
    //     }
    // } else {
    //     console.log("received null, but expected a object: Find section")
    //     findOK = false
    // }

    // ==== Find not exist ====
    let findNotExistOk = true
    const findRoleNotExist = await adminSystem.getRoleById(10)
    if (findRoleNotExist != null) {
        findNotExistOk = false
    }

    console.log("==== Result Per test ====")
    console.log("create: " + (createOk && "✅"))
    console.log("Create when existed: " + (createExistedOk && "✅"))
    console.log("Update: " + (updateOk && "✅"))
    console.log("Update existed: " + (updateExistedOk && "✅"))
    // console.log("Find: " + (findOK && "✅"))
    console.log("Find not exist: " + (findNotExistOk && "✅"))
}

async function main() {
    await testRole()
    await testPermission()
}

main()

