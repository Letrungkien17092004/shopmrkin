

export default interface AssistantMessage {
    message: string,
    role: "user" | "assistant"
    recommend_products: {
        productId: string
    }[]
}