import "express"

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string,
                account: string,
                username: string,
                email: string,
                role: string
                permissions: string[]
            }
        }
    }
}