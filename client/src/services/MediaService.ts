import axios from "axios";
import { Media } from "../types/media/index.ts"
import AuthService from "./AuthService.ts";
import { ENV } from "../config/ENV.ts";

interface UploadResponse {
    media: {
        id: string,
        fileName: string,
        filePath: string,
        hostname: string,
        media_type: "IMAGE" | "VIDEO",
        username?: string
    }[]
}
export default class MediaService {
    private readonly authService: AuthService

    constructor(authService: AuthService) {
        this.authService = authService
    }

    /**
     * Upload many media
     * 
     * @param media list file
     */
    upload = async (media: File[]): Promise<Media[]> => {
        try {
            if (this.authService.accessIsExpired()) {
                await this.authService.refeshAccess()
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
                        Authorization: `Bearer ${this.authService.getAccessToken()}`
                    }
                }
            )
            return response.data.media.map(med => ({
                id: med.id,
                fileName: med.fileName,
                filePath: med.filePath,
                hostname: med.hostname,
                type: med.media_type
            }))
        } catch (error) {
            throw error
        }
    }

    updateById = async (
        mediaId: string,
        data: {
            productId?: string,
            status?: "ORPHANED" | "ASSIGNED"
        }): Promise<void> => {
        try {
            if (this.authService.accessIsExpired()) {
                await this.authService.refeshAccess()
            }
            await axios.put<void>(
                `${ENV.BACK_END_HOST}/api/media/${mediaId}`,
                data,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${this.authService.getAccessToken()}`
                    }
                }
            )
        } catch (error) {
            throw error
        }
    }
}