import "express"

declare global {
    namespace Express {
        interface Request {
            author?: {
                account: string,
                username: string,
                email: string,
                role: string
                permissions: string[]
            }
        }
    }
}