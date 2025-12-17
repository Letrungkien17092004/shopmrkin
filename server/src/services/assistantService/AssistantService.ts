import OpenAI from "openai";
import { ENV } from "../../config/env.js";
import IProductEmbeddingUsecase from "../../core/applications/interfaces/usecases/IProductEmbeddingUsecase.js";
import EmbeddingService from "../embeddingService/EmbeddingService.js";
const client = new OpenAI({
    apiKey: ENV.LLM_KEY
});


const INSTRUCTION =
    `
# ROLE
Bạn là Chuyên viên tư vấn bán hàng thông minh của "SHOPMRKIN". Nhiệm vụ của bạn là hỗ trợ khách hàng tìm kiếm sản phẩm phù hợp và giải đáp thắc mắc một cách chuyên nghiệp, thân thiện.

# CAPABILITIES
- Bạn có quyền truy cập vào công cụ \`retrieveProduct\` để lấy thông tin sản phẩm thực tế từ kho hàng.
- Kho hàng có nhiều sản phẩm khác loại nên đổi khi kết quả không phù hợp. Hãy bỏ qua nếu không đúng yêu cầu hoặc khuyến nghị loại gần đúng
- Luôn ưu tiên sử dụng dữ liệu từ công cụ này trước khi trả lời.

# GUIDELINES & CONSTRAINTS
1. Lọc nội dung: Chỉ trả lời các câu hỏi liên quan đến mua sắm, sản phẩm của shop và hỗ trợ khách hàng. Nếu câu hỏi không liên quan, hãy từ chối lịch sự: "Xin lỗi, tôi chỉ có thể hỗ trợ các vấn đề liên quan đến sản phẩm của SHOPMRKIN."
2. Quy trình xử lý:
   - Bước 1: Phân tích nhu cầu khách hàng.
   - Bước 2: Nếu câu hỏi cần lấy dữ liệu thì đến bước 3, nếu không thì nhảy sang bước 4
   - Bước 3: Gọi hàm \`retrieveProduct\` với từ khóa phù hợp.
   - Bước 4: Phản hồi câu hỏi của khách hàng và trả về danh sách product nếu có.
3. Độ chính xác: Không tự bịa đặt thông tin sản phẩm (giá, tính năng) nếu hàm không trả về dữ liệu đó.
`

const tools: OpenAI.Responses.Tool[] = [
    {
        type: "function",
        name: "retrieveProduct",
        description: "Tìm kiếm sản phẩm dạng RAG search, trong kho SHOPMRKIN dựa trên nhu cầu người dùng",
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
            describe: "danh sách sản phẩm khuyến nghị cho người dùng, nếu không có trả về mảng rỗng"
        }
    },
    required: ["message", "recommend_products"],
    additionalProperties: false
} as const;


type HistoryMessage = {
    content: string, role: "user" | "system" | "assistant"
} | {
    type: "function_call_output",
    call_id: string,
    output: string
} | {
    type: "function_call",
    call_id: string,
    name: string,
    arguments: string,
}

type FinalOutput = {
    message: string,
    recommend_products: { productId: string }[]
}

export default class AssistantService {
    private productEmbeddingUsecase: IProductEmbeddingUsecase
    private embeddingService: EmbeddingService
    constructor(productEmbeddingUsecase: IProductEmbeddingUsecase, embeddingService: EmbeddingService) {
        this.productEmbeddingUsecase = productEmbeddingUsecase
        this.embeddingService = embeddingService
    }

    /**
     * RAG function
     * @param text 
     * @returns 
     */
    retrieveProduct = async (text: string): Promise<{
        productId: string,
        info: string
    }[]> => {
        try {
            console.log("text: ", text)
            const embedVector = await this.embeddingService.embeddings([text])
            const searchResult = await this.productEmbeddingUsecase.embeddingSearch({
                where: {
                    embedding: embedVector[0]
                }
            })

            const convertResult: {
                productId: string,
                info: string
            }[] = searchResult.map(item => ({
                productId: item.productId,
                info: item.origin_text
            }))
            return convertResult

        } catch (error) {
            console.log("error in Assistant.retrieveProduct\n", error)
            return []
        }
    }

    chat = async (currentMessage: string, historyMessage: HistoryMessage[]): Promise<FinalOutput> => {
        const input1: HistoryMessage[] = [
            ...historyMessage,
            // newest message
            {
                role: "user",
                content: currentMessage
            },
        ]

        const response = await client.responses.create({
            model: "gpt-5-nano",
            reasoning: { effort: "low" },
            instructions: INSTRUCTION,
            input: input1,
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

        const input2: HistoryMessage[] = [
            ...input1
        ]
        var final: boolean = true

        for (let i = 0; i < response.output.length; i++) {
            const item = response.output[i]!
            if (item.type === "function_call" && item.name === "retrieveProduct") {
                const args = (JSON.parse(item.arguments)) as { text: string }
                final = false
                const output = await this.retrieveProduct(args.text)
                input2.push({
                    type: "function_call",
                    name: item.name,
                    arguments: item.arguments,
                    call_id: item.call_id
                })
                input2.push({
                    type: "function_call_output",
                    output: JSON.stringify(output),
                    call_id: item.call_id
                })
            }
        }

        if (final === true) {
            // console.log("response.output_text")
            // console.log(response.output_text)
            const finalOut: FinalOutput = JSON.parse(response.output_text)
            return finalOut
        }
        const response2 = await client.responses.create({
            model: "gpt-5-nano",
            reasoning: { effort: "low" },
            instructions: INSTRUCTION,
            input: input2,
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
        // console.log("response2.output_text")
        // console.log(response2.output_text)
        const finalOut: FinalOutput = JSON.parse(response2.output_text)
        return finalOut
    }
}

// async function main() {

//     const assistant = new AssistantService()
//     const demoHis: { role: "user" | "assistant", content: string }[] = [
//         {
//             role: "user",
//             content: "xin chào tôi cần mua một vài món đồ, bạn có thể giúp tôi chứ"
//         },
//         {
//             role: "assistant",
//             content: "Chào bạn! Mình có thể giúp bạn tìm và gợi ý các món đồ từ SHOPMRKIN. Bạn hãy cho mình biết vài điều sau để mình có thể tìm đúng sản phẩm: \n- Bạn đang tìm loại hàng gì? (ví dụ: điện tử, gia dụng, làm đẹp, thời trang, phụ kiện, đồ thể thao, v.v.)\n- Ngân sách dự kiến cho mỗi món hoặc tổng ngân sách?\n- Số lượng và kích thước/ màu sắc yêu cầu (nếu có)?\n- Bạn có ưu tiên thương hiệu hay tính năng đặc biệt không?"
//         },
//     ]
//     console.log("Ket qua")
//     const result = await assistant.chat("tôi muốn tìm một chiếc điện thoại giá rẻ, thương hiệu của oppo giá từ 5tr đổ xuống", demoHis)
//     console.log(result)
// }

// main()