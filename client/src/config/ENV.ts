import { z } from "zod"

const EnvSchema = z.object({
    GENERATE_OAUTH_URL: z.string(),
    GOOGLE_CALLBACK_BE_URL: z.string(),
    BACK_END_HOST: z.string(),
    LOGIN_URL: z.string(),
})

const ENV = EnvSchema.parse({
    GENERATE_OAUTH_URL : process.env.NEXT_PUBLIC_GENERATE_OAUTH_URL,
    GOOGLE_CALLBACK_BE_URL : process.env.NEXT_PUBLIC_GOOGLE_CALLBACK_BE_URL,
    BACK_END_HOST : process.env.NEXT_PUBLIC_BACK_END_HOST,
    LOGIN_URL : process.env.NEXT_PUBLIC_LOGIN_URL,
})
export {
    ENV
}


