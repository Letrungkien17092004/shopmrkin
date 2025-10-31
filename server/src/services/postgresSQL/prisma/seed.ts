import bcrypt from "bcrypt"
import { PrismaClient } from "@prisma/client/index.js";
import { ENV } from "../../../config/env";

const prisma = new PrismaClient()
async function main() {
    const categories = await prisma.categories.createMany({
        data: [
            {
                name: "Thời trang nam",
                slug: "thời-trang-nam",
            },
            {
                name: "Thời trang nữ",
                slug: "thời-trang-nữ",
            },
            {
                name: "Thời trang trẻ em",
                slug: "thời-trang-trẻ-em",
            },
        ]
    })
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

    const hashedPassword = await bcrypt.hash(ENV.DEFAULT_ADMIN_PASSWORD, 10);
    const adminAccount = await prisma.users.create({
        data: {
            username: ENV.DEFAULT_USERNAME,
            account: ENV.DEFAULT_ACCOUNT,
            password_hash: hashedPassword,
            email: ENV.DEFAULT_EMAIL,
            roleId: adminRole.id
        }
    })
    const createdCart = await prisma.carts.create({
        data: {
            userId: adminAccount.id
        }
    })

    console.log({
        adminRole,
        customerRole,
        adminAccount,
        createdCart
    })
}


main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error("Seed isn't successfully")
        console.log(e)
        await prisma.$disconnect()
    })
