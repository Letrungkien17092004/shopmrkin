import axios from "axios";
import { z } from "zod"
type GetProfileResponse = {} & GoogleProfile

interface GoogleProfile {
    email: string,
    id: string,
    name: string,
    picture: string,
}

const GetProfileResponseBodySchema = z.object({
    email: z.string(),
    id: z.string(),
    name: z.string(),
    picture: z.string(),
})


export default class GoogleService {
    private profileUrl: string = "https://www.googleapis.com/oauth2/v1/userinfo"
    
    async getProfileByAccessToken(accessToken: string): Promise<GoogleProfile> {
        try {
            const response = await axios.get<GetProfileResponse>(
                `${this.profileUrl}?alt=json&access_token=${accessToken}`
            )

            const dataParsed = GetProfileResponseBodySchema.parse(response.data)
            return dataParsed
        } catch (error) {
            throw new Error("can't get profile")
        }

    }
}