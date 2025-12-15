import axios from "axios";

interface EmbeddingResponse {
    "text-embeddings": number[][]
}

export default class EmbeddingService {
    private readonly baseUrl = 'http://localhost:5001'

    embeddings = async (texts: string[]): Promise<number[][]> => {
        try {
            if (texts.length <= 0) {
                return []
            }
            const response = await axios.post<EmbeddingResponse>(
                `${this.baseUrl}/embeddings`,
                {
                    texts: texts
                }
            )
            return response.data["text-embeddings"]
        } catch (error) {
            throw new Error("embedding error")
        }
    }
}