import axios from "axios";
import AuthService from "./AuthService.ts";
import { ENV } from "../config/ENV.ts";

const authService = new AuthService()

interface Media {
    id: string,
    fileName: string,
    filePath: string,
    hostname: string,
    media_type: "IMAGE" | "VIDEO",
    username?: string
}
interface UploadResponse {
    media: Media[]
}
export default class MediaService {

    /**
     * Upload many media
     * 
     * @param media list file
     */
    uploadMedia = async (media: File[]): Promise<Media[]> => {
        try {
            if (authService.accessIsExpired()) {
                await authService.refeshAccess()
            }
            const formData: FormData = new FormData()
            media.forEach(i => {
                formData.append("media", i)
            })

            const response = await axios.post<UploadResponse>(
                `${ENV.BACK_END_HOST}/api/media/upload`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${authService.getAccessToken()}`
                    }
                }
            )
            return response.data.media
        } catch (error) {
            throw error
        }
    }

    assignMediaToProduct = async (listMediaId: string[], productId: string): Promise<Media[]> => {
        try {
            if (authService.accessIsExpired()) {
                await authService.refeshAccess()
            }
            const response = await axios.post<{media: Media[]}>(
                `${ENV.BACK_END_HOST}/api/media/assign-to-product`,
                {
                    listMediaId: listMediaId,
                    productId: productId
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${authService.getAccessToken()}`
                    }
                }
            )
            return response.data.media
        } catch (error) {
            throw error
        }
    }
}