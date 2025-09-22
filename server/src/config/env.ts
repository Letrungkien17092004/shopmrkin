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

    // google OAuth2 config
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    GOOGLE_OAUTH_STATE_STRING: z.string(),
    REDIRECT_URI: z.string(),
    FRONTEND_URL: z.string(),
})

export const ENV = envSchema.parse(process.env)
