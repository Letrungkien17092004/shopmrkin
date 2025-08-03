import bcrypt from "bcrypt"
import { PrismaClient } from "../generated/prisma/client/index.js";

const prisma = new PrismaClient()
async function main() {
    const adminRole = await prisma.roles.create({
        data: {
            roleName: "administrator",
            description: "can do anythings",
            permissions: {
                create: [
                    {
                        permission: {
                            create: {
                                perName: "add_admin",
                                description: "upgrade normal role to admin role"
                            }
                        }
                    },
                    {
                        permission: {
                            create: {
                                perName: "delete_admin",
                                description: "revoke administrator role"
                            }
                        }
                    },
                    {
                        permission: {
                            create: {
                                perName: "add_products",
                                description: "add products"
                            }
                        }
                    },
                    {
                        permission: {
                            create: {
                                perName: "modify_products",
                                description: "modify products"
                            }
                        }
                    },
                    {
                        permission: {
                            create: {
                                perName: "delete_products",
                                description: "delete_products"
                            }
                        }
                    }
                ]
            }
        }
    })

    const customerRole = await prisma.roles.create({
        data: {
            roleName: "customer",
            description: "view, order products",
        }
    })

    const hashedPassword = await bcrypt.hash("12345678", 10);
    const adminAccount = await prisma.users.create({
        data: {
            username: "admin",
            account: "shopmrkin@gmail.com",
            password_hash: hashedPassword,
            email: "ammenki31@gmail.com",
            roleId: adminRole.id
        }
    })

    console.log({
        adminRole,
        customerRole,
        adminAccount
    })
}


main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.log(e)
        await prisma.$disconnect()
    })
