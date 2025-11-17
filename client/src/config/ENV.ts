import { z } from "zod"

const EnvSchema = z.object({
    GENERATE_OAUTH_URL: z.string(),
    GOOGLE_CALLBACK_BE_URL: z.string(),
    BACK_END_HOST: z.string(),
})

const ENV = EnvSchema.parse({
    GENERATE_OAUTH_URL : import.meta.env.VITE_GENERATE_OAUTH_URL,
    GOOGLE_CALLBACK_BE_URL : import.meta.env.VITE_GOOGLE_CALLBACK_BE_URL,
    BACK_END_HOST : import.meta.env.VITE_BACK_END_HOST,
})
export {
    ENV
}


