import { z } from "zod"

const EnvSchema = z.object({
    GENERATE_OAUTH_URL: z.string(),
    GOOGLE_CALLBACK_BE_URL: z.string(),
})

const ENV = EnvSchema.parse({
    GENERATE_OAUTH_URL : process.env.GENERATE_OAUTH_URL,
    GOOGLE_CALLBACK_BE_URL : process.env.GOOGLE_CALLBACK_BE_URL,
})
export {
    ENV
}


