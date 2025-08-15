import dotenv from "dotenv"
import path from "path"
import { z } from "zod"
const __dirname = import.meta.dirname

dotenv.config({
    path: path.resolve(__dirname, "../../.env")
})

const envSchema = z.object({
    PORT: z.string().regex(/^\d+$/),
    JWT_SECRET: z.string().min(1),
    ACCESS_EXPRISES_IN: z.enum(['1h']),
    REFESH_EXPRISES_IN: z.enum(['3 days']),
})

export const ENV = envSchema.parse(process.env)
