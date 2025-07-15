import AdminSystemUsecase from "core/applications/usecases/AdminSystemUsecase.js";
import RolesRepository from "repositories/RolesRepository.js";
import PermissionsRepository from "repositories/PermissionsRepository.js";
import RolePerRepository from "repositories/RolePerRepository.js";
import { Role, Permission } from "core/entities/index.js"

const roleRepo = new RolesRepository()
const perRepo = new PermissionsRepository()
const rolePerRepo = new RolePerRepository()
const adminSystem = new AdminSystemUsecase(roleRepo, perRepo, rolePerRepo)

const rawRoles: Pick<Role, "roleName" | "description">[] = [
    {
        roleName: "Admin",
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

/**
 * Test Role
 * @remarks test create, read, update, delete
 */
async function testRole() {
    const rawRoles: Pick<Role, "roleName" | "description">[] = [
        {
            roleName: "Admin",
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



    console.log("==== RESULT ====")
    console.log("CREATE: " + createOk)
}

async function main() {
    await testRole()
}

main()

