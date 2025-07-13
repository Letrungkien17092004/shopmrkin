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

const rawPers: Pick<Permission, "perName" | "description">[] = [
    {
        perName: "delete all",
        description: "delete all data"
    },
    {
        perName: "create all",
        description: "create all data"
    },
    {
        perName: "modify all",
        description: "modify all data"
    }
]

async function create() {
    const roles = []
    for (let i = 0; i < rawRoles.length; i++) {
        roles.push(await adminSystem.createRole(rawRoles[i]))
    }

    const pers = []

    for (let i = 0; i < rawPers.length; i++) {
        pers.push(await adminSystem.createPermission(rawPers[i]))
    }

    console.log("==== ROLES ====")
    console.table(roles)

    console.log("\n==== PERMISSIONS ====")
    console.table(pers)

    const rolePers = []
    rolePers.push(await adminSystem.createRelationships(roles[0].id, pers[0].id))
    rolePers.push(await adminSystem.createRelationships(roles[0].id, pers[1].id))
    rolePers.push(await adminSystem.createRelationships(roles[0].id, pers[2].id))

    console.log("\n==== ROLE <-> PER ====")
    console.table(rolePers)
}

async function read() {
    const role = await adminSystem.getRoleById(1)
    console.log(role)
}

async function update() {
    const role = await adminSystem.updateRole({
        id: 10,
        roleName: "admin_changed 2"
    })

    console.log(role)
}
async function main() {
    // await create()
    // await read()
    await update()
}

main()

