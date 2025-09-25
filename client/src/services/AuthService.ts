import axios from "axios"
import { ENV } from "../config/ENV.ts"

type UserProfile = {
    id: string,
    email: string,
    account: string,
    username: string,
}

export default class AuthService {


    /**
     * Store the user's profile in localStorage
     * @param profile 
     */
    storeProfile(profile: UserProfile): void {
        localStorage.setItem("profile", JSON.stringify(profile))
    }

    getProfile(): UserProfile {
        const profile: UserProfile | null = JSON.parse(localStorage.getItem("profile") || "null")
        if (profile == null) {
            throw new Error("profile is invalid")
        }
        return profile

    }

    /**
     * Store the refesh_token in localStorage along with createdAt time (as DateString)
     * @param refeshToken 
     */
    storeRefeshToken(refeshToken: string): void {
        localStorage.setItem("refesh_token", refeshToken)
        localStorage.setItem("refesh_token_createdAt", new Date(Date.now()).toDateString())
    }

    /**
     * Store the access_token in localStorage along with createdAt time (as DateString)
     * @param accessToken 
     */
    storeAccessToken(accessToken: string): void {
        localStorage.setItem("access_token", accessToken)
        localStorage.setItem("access_token_createdAt", new Date(Date.now()).toDateString())
    }

    /**
     * Retrieves access_token from localStorage
     * @returns {string}
     */
    getAccessToken(): string {
        const token = localStorage.getItem("access_token") || ""
        return token
    }

    /**
     * Check the expiry date of access_token
     * @returns {boolean}
     */
    accessIsExpired(): boolean {
        const currentTime = new Date(Date.now())
        const createdAtString = localStorage.getItem("access_token_createdAt") || ""
        const tokenCreatedAtTime = new Date(createdAtString)

        // if createdAtString is invalid, tokenCreatedAtTime will be null
        if (!tokenCreatedAtTime) { throw new Error("access_token is null") }

        const isExpired = currentTime.getTime() - tokenCreatedAtTime.getTime() / 1000 / 60

        return isExpired > 15 ? false : true
    }

    /**
     * Retrieves the Google OAuth2 login URL
     * 
     * This method send a request to the server to generate and return 
     * a Google OAuth2 login URL. The user can then redirected to 
     * this URL to login with Google
     * 
     * @returns {Promise<string>} A Promise that resolve to the Google OAuth2 URL
     */
    async getGoogleOauth2Url(): Promise<string> {
        const response = await axios<{ url: string }>(ENV.GENERATE_OAUTH_URL)
        return response.data.url
    }

    /**
     * Logs in a user using OAuth2 after the user has granted access
     * 
     * This method sends the `state` and `access_token` obtained from Google to the server.
     * the server then uses these values to request the user's profile from Google API.
     * 
     * if successful, the server respons profile, access_token, refesh_token to brownser
     * @param state 
     * @param access_token 
     * @returns 
     */
    async LoginWithGooogle(state: string, access_token: string): Promise<boolean> {
        try {
            type ResponseData = {
                profile: UserProfile,
                refeshToken: string,
                accessToken: string,
            }
            const response = await axios.get<ResponseData>(ENV.GOOGLE_CALLBACK_BE_URL, {
                params: {
                    state: state,
                    access_token: access_token,
                }
            })

            this.storeRefeshToken(response.data.refeshToken)
            this.storeAccessToken(response.data.accessToken)
            this.storeProfile(response.data.profile)
            console.log(response.data)
            return true
        } catch (error) {
            return false
        }
    }

    /**
     * Verify access_token is valid
     * @returns 
     */
    async veriyAccessToken(): Promise<boolean> {
        try {
            const token = localStorage.getItem("accessToken");
            const response = await axios.get("http://localhost:8000/api/author/verify-access-token", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (response.status == 200) {
                return true
            }
            return false
        } catch (error) {
            return false
        }
    }


    /**
     * Refesh access_token
     * 
     * this method sends a request to server to obtain new access_token
     * @returns {Promise<boolean>}
     */
    async refeshAccess(): Promise<boolean> {
        try {
            type APIResponse = {
                message: string,
                accessToken: string
            }
            const response = await axios.get<APIResponse>(`${ENV.BACK_END_HOST}/api/auth/refesh-access-token`)
            console.log(response)
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }
}