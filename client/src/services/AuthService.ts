import axios from "axios"
import { ENV } from "../config/ENV.ts"

export default class AuthService {

    async getGoogleOauth2Url(): Promise<string> {
        const response = await axios<{ url: string }>(ENV.GENERATE_OAUTH_URL)
        return response.data.url
    }

    async LoginWithGooogle(state: string, access_token: string): Promise<boolean> {
        try {
            type ResponseData = {
                profile: object,
                refeshToken: string,
                accessToken: string,
                
            }
            const response = await axios.get<ResponseData>(ENV.GOOGLE_CALLBACK_BE_URL, {
                params: {
                    state: state,
                    access_token: access_token,
                }
            })

            localStorage.setItem("refeshToken", response.data.refeshToken)
            localStorage.setItem("accessToken", response.data.accessToken)
            console.log(response.data)
            return true
        } catch (error) {
            return false
        }
    }

    async veriyAccessToken(): Promise<boolean> {
        try {
            const token = localStorage.getItem("accessToken");
            const response = await axios.get("http://localhost:8000/api/author/verify-access-token",{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(response.data)
            return true
        } catch (error) {
            return false
        }
    }
}