import OpenAI from "openai";
import { ENV } from "../../config/env.js";
const client = new OpenAI({
    apiKey: ENV.LLM_KEY
});


const INSTRUCTION =
    `
# ROLE
Bạn là công cụ trích xuất dữ liệu từ đoạn chat. bạn cần trích xuất các thông tin hữu ích từ đoạn chat được cung cấp,
đoạn chat đã được parse sang json.

# CAPABILITIES
- Không có

# GUIDELINES & CONSTRAINTS
1. Trích xuất dữ liệu: 
- Trích xuất dữ liệu như username, phone, interest (xu hướng tìm kiếm ví dụ: iphone 17 promax, điện thoại samsung,..)
category (danh mục ví dụ như: smartphone, laptop, pc, màn hình,...). Nếu không có để chuỗi rỗng

2. Đánh giá đoạn chat là spam hay không
- đánh giá là spam khi không trích xuất được thông tin hữu ích, hoặc đoạn chat không liên quan, đoạn chat ngắn

3. Độ chính xác: Không tự bịa đặt thông tin.
`


const shopResponseSchema = {
    type: "object",
    properties: {
        isSpam: {
            type: "boolean",
            description: "Đánh giá đoạn chat có phải là spam hay không"
        },
        extracted_data: {
            type: "object",
            properties: {
                username: {
                    type: "string",
                    describe: "tên người dùng. nếu không có để chuỗi rỗng"
                },
                phone: {
                    type: "string",
                    describe: "tên người dùng. nếu không có để chuỗi rỗng"
                },
                interest: {
                    type: "string",
                    describe: "xu hướng tìm kiếm (điện thoại iphone, điện thoại xiaomi,...). nếu không có để chuỗi rỗng"
                },
                category: {
                    type: "string",
                    describe: "loại mặt hàng tìm kiếm (smartphone, laptop, pc,...). nếu không có để chuỗi rỗng"
                },
            },
            required: ["username", "phone", "interest", "category"],
            additionalProperties: false,
            describe: "những dữ liệu đã trích xuất được"
        }
    },
    required: ["isSpam", "extracted_data"],
    additionalProperties: false
} as const;

interface ExtractorServiceOutput {
    isSpam: boolean,
    extracted_data: {
        username: string
        phone: string
        interest: string
        category: string
    }
}

export default class ExtractorService {


    extract = async (data: {
        role: "user" | "assistant",
        content: string
    }[]): Promise<ExtractorServiceOutput> => {

        const response = await client.responses.create({
            model: "gpt-5-nano",
            reasoning: { effort: "low" },
            instructions: INSTRUCTION,
            input: [
                {
                    role: "user",
                    content: JSON.stringify(data)
                }
            ],
            text: {
                format: {
                    type: "json_schema",
                    name: "response_schema",
                    strict: true,
                    schema: shopResponseSchema
                }
            }
        });

        // console.log("response.output_text")
        // console.log(response.output_text)
        const finalOut: ExtractorServiceOutput = JSON.parse(response.output_text)
        return finalOut
    }
}

// async function main() {

//     const extractor = new ExtractorService()

//     const demoChat1: { role: "user" | "assistant", content: string }[] = [
//         {
//             role: "user",
//             content: "xin chào tôi cần mua một chiếc điện thoại iphone giá dưới 20tr"
//         },
//         {
//             role: "assistant",
//             content: "Chào bạn hiện tại shop chúng tôi có sản phẩm Iphone 15 promax 128Gb giá 16tr"
//         },
//         {
//             role: "user",
//             content: "tên tôi là Mr Kin sdt: 0123123123, hãy gọi điện tư vấn cho tôi"
//         },
//     ]

//     const demoChat2: { role: "user" | "assistant", content: string }[] = [
//         {
//             role: "user",
//             content: "xin chào tôi cần mua một chiếc điện thoại iphone giá dưới 20tr"
//         },
//         {
//             role: "assistant",
//             content: "Chào bạn hiện tại shop chúng tôi có sản phẩm Iphone 15 promax 128Gb giá 16tr"
//         },
//     ]

//     const demoChat3: { role: "user" | "assistant", content: string }[] = [
//         {
//             role: "user",
//             content: "xin chào"
//         },
//         {
//             role: "assistant",
//             content: "Chào bạn, tôi là chatbot chăm sóc khách hàng, tôi có thể giúp gì cho bạn?"
//         },
//     ]

//     const result1 = await extractor.extract(demoChat1)
//     const result2 = await extractor.extract(demoChat2)
//     const result3 = await extractor.extract(demoChat3)
//     console.log("ket qua 1")
//     console.log(result1)
//     console.log("ket qua 2")
//     console.log(result2)
//     console.log("ket qua 2")
//     console.log(result3)
// }

// main()


