import { Profile } from "./index.ts"

export default interface User {
    id: string
    username: string
    account: string
    profile: Profile
}