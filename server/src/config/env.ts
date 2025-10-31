import dotenv from "dotenv"
import path from "path"
import { z } from "zod"
const __dirname = import.meta.dirname

dotenv.config({
    path: path.resolve(__dirname, "../../.env")
})

const envSchema = z.object({
    SERVER_NAME: z.string(),
    PORT: z.string().regex(/^\d+$/),
    JWT_SECRET: z.string().min(1),
    ACCESS_EXPRISES_IN: z.enum(['1h']),
    REFESH_EXPRISES_IN: z.enum(['3 days', "7 days"]),
    DEFAULT_USERNAME: z.string(),
    DEFAULT_ACCOUNT: z.string(),
    DEFAULT_ADMIN_PASSWORD: z.string(),
    DEFAULT_EMAIL: z.string(),

    // google OAuth2 config
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    GOOGLE_OAUTH_STATE_STRING: z.string(),

    // Upload folder
    UPLOAD_FOLDER: z.string(),
})

export const ENV = envSchema.parse({
    ...process.env
})
