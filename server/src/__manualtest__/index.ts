import { PrismaClient } from "@prisma/client";
import axios from "axios";

const BASE_URL = "http://localhost:5001"

const demoDescribes = [
    "iPhone Air 256GB được Apple ra mắt với thiết kế siêu mỏng 5,64mm, khung titanium bền bỉ và màn hình Super Retina XDR 6,5 inch hỗ trợ ProMotion 120Hz. Máy trang bị chip A19 Pro kết hợp N1, mang lại hiệu suất mạnh mẽ. Camera Fusion 48MP cùng camera trước 18MP Center Stage giúp người dùng ghi lại hình ảnh sắc nét, quay video 4K ổn định.",
    "iPhone 16 Pro Max được trang bị chip A18 Pro mạnh mẽ, mang đến hiệu năng vượt trội và khả năng xử lý đồ họa mượt mà hơn nhiều so với thế hệ trước. Màn hình Super Retina XDR 6.9 inch hỗ trợ ProMotion 120Hz cho chất lượng hiển thị sống động. Cụm camera tiềm vọng 5x của máy giúp nâng cấp chất lượng chụp ảnh",
    "Xiaomi 14T Pro là lựa chọn lý tưởng cho những ai muốn sở hữu khả năng nhiếp ảnh chuẩn Leica và hiệu năng ngang tầm flagship trong thiết kế cao cấp. Xiaomi tích hợp bộ xử lý MediaTek Dimensity 9300+ và màn hình AMOLED 144Hz 4000 nit. Sản phẩm tích hợp sạc HyperCharge 120W giúp nạp đầy pin 5000mAh trong 19 phút.",
    "OPPO Find X9 Pro sở hữu màn hình AMOLED 6.78 inch độ phân giải 1.5K+ (1272 x 2772 pixel), hỗ trợ tần số quét 120Hz và độ sáng tối đa 1800 nits, mang đến trải nghiệm hiển thị sắc nét và mượt mà trong mọi điều kiện ánh sáng. Máy trang bị camera tiềm vọng 200MP OIS cho khả năng phóng to ấn tượng",
    "iPhone 14 128GB sở hữu màn hình Retina XDR OLED kích thước 6.1 inch cùng độ sáng vượt trội lên đến 1200 nits. Máy cũng được trang bị camera kép 12 MP phía sau cùng cảm biến điểm ảnh lớn, đạt 1.9 micron giúp cải thiện khả năng chụp thiếu sáng. Mẫu iPhone 14 mới cũng mang trong mình con chip Apple A15 Bionic phiên bản 5 nhân mang lại hiệu suất vượt trội.",
    "Xiaomi POCO X7 Pro 5G 12GB 256GB - Chỉ có tại CellphoneS",
    "Samsung Galaxy S25 Ultra mạnh mẽ với chip Snapdragon 8 Elite For Galaxy mới nhất, RAM 12GB và bộ nhớ trong 256GB-1TB. Hệ thống 3 camera sau chất lượng gồm camera chính 200MP, camera tele 50MP và camera góc siêu rộng 50MP. Thiết kế kính cường lực Corning Gorilla Armor 2 và khung viền Titanium, màn hình Dynamic AMOLED 6.9 inch. Điện thoại này còn có viên pin 5000mAh, hỗ trợ 5G và Galaxy AI ấn tượng, nâng cao trải nghiệm người dùng!",
    "Điện thoại realme C61 nổi bật với hiệu suất hoạt động ổn định và mượt mà cùng lúc nhiều tác vụ khác nhau nhờ trang bị chip UNISOC T612 cùng GPU Mali-G57. Kết hợp với RAM 4GB (Có thể mở rộng lên đến 8GB), bộ nhớ trong 128GB còn đem đến không gian lưu trữ dữ liệu đủ để đáp ứng các nhu cầu của người dùng. Bên cạnh đó, máy còn tích hợp bộ đôi camera gồm camera selfie 5MP và camera sau 50MP cho ảnh chụp sắc nét, rõ ràng",
    "Điện thoại HONOR X9d nổi bật với pin “khủng” 8300 mAh, chuẩn kháng nước, bụi IP69K và khả năng chịu rơi từ 2.5 m, cùng camera chính lên đến 108 MP. Cấu hình máy mạnh mẽ, màn hình AMOLED rộng phù hợp với mọi tác vụ. Máy được trang bị công nghệ AI tân tiến, giúp người dùng chỉnh ảnh, video hiệu quả",
    "Điện thoại Sony Xperia 1 VII sở hữu hiệu năng mạnh mẽ với chip Snapdragon 8 Elite, RAM 12GB và bộ nhớ trong 256GB mang đến trải nghiệm sử dụng mượt mà. Máy trang bị màn hình OLED FHD+ HDR kích thước 6.5 inch cùng tần số quét 120Hz. Hệ thống camera sau gồm 3 ống kính độ phân giải 52MP, 12MP và 50MP kết hợp cùng camera selfie 12MP"
]

interface EmbeddingResponse {
    "text-embeddings": number[][]
}
const prisma = new PrismaClient()


async function textEmbedding(texts: string[]): Promise<number[][]> {
    console.log("Start embedding!")
    const response = await axios.post<EmbeddingResponse>(
        `${BASE_URL}/embeddings`,
        {
            texts: texts
        }
    )
    console.log("embed successfully")
    return response.data["text-embeddings"]
}

async function insertItems(values: string) {
    const result = await prisma.$executeRawUnsafe(`INSERT INTO "TestEmbedding" ("content", "embedding") VALUES ${values}`)
}

async function search(vector: number[]): Promise<void> {
    const v = `[${vector.join(',')}]`
    const sql = 
        `
        select content from "TestEmbedding"
        order by "embedding" <=> '${v}' limit 10
        `
    const result = await prisma.$queryRawUnsafe(sql)
    console.log("search results: ")
    console.log(result)
}

async function main() {
    console.log("Start")
    // const embeddings = await textEmbedding(demoDescribes)
    const searchVector = await textEmbedding(["điện thoại xiaomi"])
    // const values = embeddings.map((value, index) => {
    //     const text = demoDescribes[index].replaceAll('\'', "").replaceAll('\"', "")
    //     return `('${text}', '[${value.join(",")}]')`
    // })
    // await insertItems(values.join(","))
    await search(searchVector[0])
    console.log("Ended")

}

main()