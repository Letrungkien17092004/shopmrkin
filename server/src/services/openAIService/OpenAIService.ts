import OpenAI from "openai";
import { ENV } from "../../config/env.js";
import IProductEmbeddingUsecase from "../../core/applications/interfaces/usecases/IProductEmbeddingUsecase.js";


const client = new OpenAI({
    apiKey: ENV.LLM_KEY
});


const INSTRUCTION =
    `
# ROLE
Bạn là Chuyên viên tư vấn bán hàng thông minh của "SHOPMRKIN". Nhiệm vụ của bạn là hỗ trợ khách hàng tìm kiếm sản phẩm phù hợp và giải đáp thắc mắc một cách chuyên nghiệp, thân thiện.

# CAPABILITIES
- Bạn có quyền truy cập vào công cụ \`retrieveProduct\` để lấy thông tin sản phẩm thực tế từ kho hàng.
- Luôn ưu tiên sử dụng dữ liệu từ công cụ này trước khi trả lời.

# GUIDELINES & CONSTRAINTS
1. Lọc nội dung: Chỉ trả lời các câu hỏi liên quan đến mua sắm, sản phẩm của shop và hỗ trợ khách hàng. Nếu câu hỏi không liên quan, hãy từ chối lịch sự: "Xin lỗi, tôi chỉ có thể hỗ trợ các vấn đề liên quan đến sản phẩm của SHOPMRKIN."
2. Quy trình xử lý:
   - Bước 1: Phân tích nhu cầu khách hàng.
   - Bước 2: Gọi hàm \`retrieveProduct\` với từ khóa phù hợp.
   - Bước 3: Tổng hợp thông tin từ kết quả hàm trả về để phản hồi.
3. Độ chính xác: Không tự bịa đặt thông tin sản phẩm (giá, tính năng) nếu hàm không trả về dữ liệu đó.
`

// giả định hàm retrieveProduct
// hàm này nhận vào text để search RAG
async function retrieveProduct(text: string): Promise<{ productId: string; name: string }[]> {
    // search RAG / DB / vector
    return [
        { productId: "p001", name: "Áo thun nam cotton" },
        { productId: "p002", name: "Áo sơ mi công sở" }
    ];
}

const tools: OpenAI.Responses.Tool[] = [
    {
        type: "function",
        name: "retrieveProduct",
        description: "Tìm kiếm sản phẩm trong kho SHOPMRKIN dựa trên nhu cầu người dùng",
        parameters: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "Từ khóa hoặc mô tả nhu cầu tìm kiếm sản phẩm"
                },
            },
            required: ["text"],
            additionalProperties: false
        },
        strict: true,
    },
];



const shopResponseSchema = {
    type: "object",
    properties: {
        message: {
            type: "string",
            description: "Câu trả lời tư vấn tự nhiên, lôi cuốn, không quá dài"
        },
        recommend_products: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    productId: {
                        type: "string"
                    }
                },
                required: ["productId"],
                additionalProperties: false
            },
        }
    },
    required: ["message", "recommend_products"],
    additionalProperties: false
} as const;


async function main() {
    const response = await client.responses.create({
        model: "gpt-5-nano",
        reasoning: { effort: "low" },
        instructions: INSTRUCTION,
        input: [
            {
                role: "system",
                content: INSTRUCTION
            },
            {
                role: "user",
                content: "Xin chào tôi muốn mua một vài món đồ, bạn có thể giúp tôi chứ"
            }
        ],
        text: {
            format: {
                type: "json_schema",
                name: "response_schema",
                strict: true,
                schema: shopResponseSchema
            }
        },
        tools
    });

    console.log(response);
}

main();

export default class OpenAIService {
    private productEmbeddingUsecase: IProductEmbeddingUsecase

    constructor(productEmbeddingUsecase: IProductEmbeddingUsecase) {
        this.productEmbeddingUsecase = productEmbeddingUsecase
    }

    chat = async (currentMessage: string, historyMessage: { content: string, role: string }): Promise<{
        message: string,
        recommend_products: {
            productId: string
        }[]
    }> => {
        return {
            message: "ok",
            recommend_products: []
        }
    }
}