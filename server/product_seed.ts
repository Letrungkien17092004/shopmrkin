import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { ENV } from "./src/config/env.js";

const prisma = new PrismaClient();

type ComponentCategory =
    | "cpu"
    | "main"
    | "ram"
    | "gpu"
    | "psu"
    | "ssd"
    | "case"
    | "cooler"
    | "mouse"
    | "keyboard"
    | "monitor";

type PlatformTag = "AM4_DDR4" | "AM5_DDR5" | "LGA1700_DDR4" | "LGA1700_DDR5" | "UNIVERSAL";

interface ProductSeedItem {
    name: string;
    description: string;
    categoryKey: ComponentCategory;
    variantName: string;
    sku: string;
    price: number;
    stock: number;
    mediaFileName: string;
    platform: PlatformTag;
    tier: "budget" | "mid" | "high";
}

function buildProductCatalog(): ProductSeedItem[] {
    const items: ProductSeedItem[] = [];
    let skuCounter = 1;
    const nextSku = (prefix: string) => `SKU-${prefix}-${String(skuCounter++).padStart(4, "0")}`;

    // 1. CPU (24 items)
    const cpus: { name: string; desc: string; platform: PlatformTag; tier: "budget" | "mid" | "high"; price: number; variant: string }[] = [
        { name: "CPU AMD Ryzen 3 3200G", desc: "CPU AMD Socket AM4 4 nhân 4 luồng tích hợp Radeon Vega 8 phù hợp Mainboard A320 B450 RAM DDR4", platform: "AM4_DDR4", tier: "budget", price: 1890000, variant: "Box Chính Hãng - Socket AM4" },
        { name: "CPU AMD Ryzen 5 3600", desc: "CPU AMD Socket AM4 6 nhân 12 luồng 3.6GHz phù hợp Mainboard B450 B550 RAM DDR4", platform: "AM4_DDR4", tier: "budget", price: 2390000, variant: "Box Chính Hãng - Socket AM4" },
        { name: "CPU AMD Ryzen 5 5500", desc: "CPU AMD Socket AM4 6 nhân 12 luồng kiến trúc Zen 3 đi kèm Mainboard B450 B550 RAM DDR4", platform: "AM4_DDR4", tier: "budget", price: 2450000, variant: "Box Chính Hãng - Socket AM4" },
        { name: "CPU AMD Ryzen 5 5600", desc: "CPU AMD Socket AM4 6 nhân 12 luồng 35MB Cache chơi game mượt với B550 và RAM DDR4", platform: "AM4_DDR4", tier: "mid", price: 3290000, variant: "Box Chính Hãng - Socket AM4" },
        { name: "CPU AMD Ryzen 5 5600X", desc: "CPU AMD Socket AM4 6 nhân 12 luồng xung nhịp 4.6GHz tối ưu cho Mainboard B550 X570 RAM DDR4", platform: "AM4_DDR4", tier: "mid", price: 3790000, variant: "Box Chính Hãng - Socket AM4" },
        { name: "CPU AMD Ryzen 7 5700X", desc: "CPU AMD Socket AM4 8 nhân 16 luồng hiệu năng cao cho đồ họa và gaming với B550 X570 RAM DDR4", platform: "AM4_DDR4", tier: "mid", price: 4690000, variant: "Tray Không Fan - Socket AM4" },
        { name: "CPU AMD Ryzen 7 5700X3D", desc: "CPU AMD Socket AM4 8 nhân 16 luồng 3D V-Cache 96MB chuyên game đi với B550 X570 DDR4", platform: "AM4_DDR4", tier: "high", price: 5690000, variant: "Box Chính Hãng - Socket AM4" },
        { name: "CPU AMD Ryzen 7 5800X3D", desc: "CPU AMD Socket AM4 8 nhân 16 luồng đỉnh cao gaming thế hệ AM4 dùng RAM DDR4", platform: "AM4_DDR4", tier: "high", price: 7890000, variant: "Box Chính Hãng - Socket AM4" },

        { name: "CPU AMD Ryzen 5 7500F", desc: "CPU AMD Socket AM5 6 nhân 12 luồng kiến trúc Zen 4 tương thích Mainboard A620 B650 RAM DDR5", platform: "AM5_DDR5", tier: "mid", price: 3990000, variant: "Tray Chính Hãng - Socket AM5" },
        { name: "CPU AMD Ryzen 5 7600", desc: "CPU AMD Socket AM5 6 nhân 12 luồng 5.1GHz dùng cho Mainboard B650 X670 và RAM DDR5", platform: "AM5_DDR5", tier: "mid", price: 4890000, variant: "Box Chính Hãng - Socket AM5" },
        { name: "CPU AMD Ryzen 5 7600X", desc: "CPU AMD Socket AM5 6 nhân 12 luồng 5.3GHz hiệu năng cao cho Mainboard B650 X670 DDR5", platform: "AM5_DDR5", tier: "mid", price: 5490000, variant: "Box Chính Hãng - Socket AM5" },
        { name: "CPU AMD Ryzen 7 7700X", desc: "CPU AMD Socket AM5 8 nhân 16 luồng 5.4GHz tối ưu cho Mainboard B650 X670 RAM DDR5", platform: "AM5_DDR5", tier: "high", price: 7990000, variant: "Box Chính Hãng - Socket AM5" },
        { name: "CPU AMD Ryzen 7 7800X3D", desc: "CPU AMD Socket AM5 8 nhân 16 luồng 3D V-Cache vua gaming đi kèm B650 X670 RAM DDR5", platform: "AM5_DDR5", tier: "high", price: 10490000, variant: "Box Chính Hãng - Socket AM5" },
        { name: "CPU AMD Ryzen 9 7900X", desc: "CPU AMD Socket AM5 12 nhân 24 luồng cho workstation chuyên nghiệp Mainboard X670 DDR5", platform: "AM5_DDR5", tier: "high", price: 10990000, variant: "Box Chính Hãng - Socket AM5" },
        { name: "CPU AMD Ryzen 9 7950X", desc: "CPU AMD Socket AM5 16 nhân 32 luồng flagship render 3D dùng Mainboard X670E và RAM DDR5", platform: "AM5_DDR5", tier: "high", price: 14990000, variant: "Box Chính Hãng - Socket AM5" },
        { name: "CPU AMD Ryzen 7 9700X", desc: "CPU AMD Socket AM5 Zen 5 8 nhân 16 luồng tiết kiệm điện hiệu năng cao cho B650 X870 DDR5", platform: "AM5_DDR5", tier: "high", price: 9490000, variant: "Box Chính Hãng - Socket AM5" },

        { name: "CPU Intel Core i3 12100F", desc: "CPU Intel Socket LGA1700 4 nhân 8 luồng quốc dân cho Mainboard H610 B660 B760 RAM DDR4", platform: "LGA1700_DDR4", tier: "budget", price: 2150000, variant: "Box Chính Hãng - LGA1700" },
        { name: "CPU Intel Core i3 13100F", desc: "CPU Intel Socket LGA1700 4 nhân 8 luồng thế hệ 13 phù hợp H610 B760 RAM DDR4", platform: "LGA1700_DDR4", tier: "budget", price: 2590000, variant: "Box Chính Hãng - LGA1700" },
        { name: "CPU Intel Core i5 12400F", desc: "CPU Intel Socket LGA1700 6 nhân 12 luồng gaming tầm trung tốt nhất với B660 B760 RAM DDR4", platform: "LGA1700_DDR4", tier: "mid", price: 3090000, variant: "Box Chính Hãng - LGA1700" },
        { name: "CPU Intel Core i5 13400F", desc: "CPU Intel Socket LGA1700 10 nhân 16 luồng đa nhiệm mượt mà với Mainboard B760 DDR4", platform: "LGA1700_DDR4", tier: "mid", price: 4690000, variant: "Box Chính Hãng - LGA1700" },

        { name: "CPU Intel Core i5 13600K", desc: "CPU Intel Socket LGA1700 14 nhân 20 luồng hiệu năng cao đi cùng B760 Z790 RAM DDR5", platform: "LGA1700_DDR5", tier: "high", price: 7290000, variant: "Box Chính Hãng - LGA1700" },
        { name: "CPU Intel Core i5 14600K", desc: "CPU Intel Socket LGA1700 Gen 14 14 nhân 20 luồng xung nhịp 5.3GHz cho Z790 RAM DDR5", platform: "LGA1700_DDR5", tier: "high", price: 7990000, variant: "Box Chính Hãng - LGA1700" },
        { name: "CPU Intel Core i7 14700K", desc: "CPU Intel Socket LGA1700 20 nhân 28 luồng chuyên đồ họa và gaming cao cấp với Z790 DDR5", platform: "LGA1700_DDR5", tier: "high", price: 10490000, variant: "Box Chính Hãng - LGA1700" },
        { name: "CPU Intel Core i9 14900K", desc: "CPU Intel Socket LGA1700 24 nhân 32 luồng 6.0GHz flagship dùng Mainboard Z790 RAM DDR5", platform: "LGA1700_DDR5", tier: "high", price: 13990000, variant: "Box Chính Hãng - LGA1700" }
    ];

    for (const c of cpus) {
        items.push({
            name: c.name,
            description: c.desc,
            categoryKey: "cpu",
            variantName: c.variant,
            sku: nextSku("CPU"),
            price: c.price,
            stock: 50,
            mediaFileName: "cpu_demo.png",
            platform: c.platform,
            tier: c.tier
        });
    }

    // 2. Mainboard (24 items)
    const mainboards: { name: string; desc: string; platform: PlatformTag; tier: "budget" | "mid" | "high"; price: number; variant: string }[] = [
        { name: "Mainboard ASUS Prime B450M-A II", desc: "Bo mạch chủ Socket AM4 hỗ trợ CPU AMD Ryzen 3000 5000 và 4 khe RAM DDR4", platform: "AM4_DDR4", tier: "budget", price: 1790000, variant: "mATX - Socket AM4 - DDR4" },
        { name: "Mainboard MSI B450M-A PRO MAX II", desc: "Bo mạch chủ Socket AM4 bền bỉ cho CPU Ryzen 3 5 và RAM DDR4", platform: "AM4_DDR4", tier: "budget", price: 1590000, variant: "mATX - Socket AM4 - DDR4" },
        { name: "Mainboard Gigabyte B550M DS3H", desc: "Bo mạch chủ Socket AM4 PCIe 4.0 hỗ trợ Ryzen 5000 và RAM DDR4 3200MHz", platform: "AM4_DDR4", tier: "mid", price: 2390000, variant: "mATX - Socket AM4 - DDR4" },
        { name: "Mainboard MSI MAG B550M MORTAR WiFi", desc: "Bo mạch chủ Socket AM4 VRM khỏe cho Ryzen 5 5600X Ryzen 7 5700X3D RAM DDR4", platform: "AM4_DDR4", tier: "mid", price: 3490000, variant: "mATX - Socket AM4 - DDR4" },
        { name: "Mainboard ASUS TUF Gaming B550M-PLUS WiFi II", desc: "Bo mạch chủ gaming Socket AM4 chuẩn quân đội hỗ trợ Ryzen 5000 RAM DDR4", platform: "AM4_DDR4", tier: "mid", price: 3390000, variant: "mATX - Socket AM4 - DDR4" },
        { name: "Mainboard ASRock B550M Pro4", desc: "Bo mạch chủ Socket AM4 4 khe RAM DDR4 tản nhiệt VRM lớn cho CPU AMD Ryzen", platform: "AM4_DDR4", tier: "mid", price: 2490000, variant: "mATX - Socket AM4 - DDR4" },

        { name: "Mainboard MSI PRO B650M-P", desc: "Bo mạch chủ Socket AM5 hỗ trợ CPU AMD Ryzen 7000 9000 và RAM DDR5 6000MHz", platform: "AM5_DDR5", tier: "mid", price: 3190000, variant: "mATX - Socket AM5 - DDR5" },
        { name: "Mainboard ASUS TUF Gaming B650M-E WiFi", desc: "Bo mạch chủ Socket AM5 cho CPU Ryzen 5 7600 Ryzen 7 7800X3D hỗ trợ RAM DDR5", platform: "AM5_DDR5", tier: "mid", price: 4290000, variant: "mATX - Socket AM5 - DDR5" },
        { name: "Mainboard Gigabyte B650M AORUS ELITE AX", desc: "Bo mạch chủ cao cấp Socket AM5 12+2+2 Phases VRM cho Ryzen 7000 RAM DDR5", platform: "AM5_DDR5", tier: "high", price: 5290000, variant: "mATX - Socket AM5 - DDR5" },
        { name: "Mainboard ASRock B650M PG Riptide WiFi", desc: "Bo mạch chủ gaming Socket AM5 tối ưu cho CPU AMD Ryzen 7000 và RAM DDR5", platform: "AM5_DDR5", tier: "mid", price: 4390000, variant: "mATX - Socket AM5 - DDR5" },
        { name: "Mainboard ASUS ROG Strix B650-A Gaming WiFi", desc: "Bo mạch chủ ATX màu trắng Socket AM5 hỗ trợ Ryzen 7 7800X3D và RAM DDR5", platform: "AM5_DDR5", tier: "high", price: 6490000, variant: "ATX - Socket AM5 - DDR5" },
        { name: "Mainboard MSI MAG X670E TOMAHAWK WiFi", desc: "Bo mạch chủ cao cấp Socket AM5 PCIe 5.0 cho Ryzen 9 7900X 7950X RAM DDR5", platform: "AM5_DDR5", tier: "high", price: 7990000, variant: "ATX - Socket AM5 - DDR5" },

        { name: "Mainboard ASUS Prime H610M-K D4", desc: "Bo mạch chủ Socket LGA1700 giá rẻ cho Intel Core i3 12100F i5 12400F RAM DDR4", platform: "LGA1700_DDR4", tier: "budget", price: 1850000, variant: "mATX - LGA1700 - DDR4" },
        { name: "Mainboard MSI PRO H610M-E DDR4", desc: "Bo mạch chủ văn phòng và gaming nhẹ Socket LGA1700 dùng RAM DDR4", platform: "LGA1700_DDR4", tier: "budget", price: 1750000, variant: "mATX - LGA1700 - DDR4" },
        { name: "Mainboard Gigabyte B760M DS3H DDR4", desc: "Bo mạch chủ Socket LGA1700 4 khe RAM DDR4 hỗ trợ Intel Gen 12 13 14", platform: "LGA1700_DDR4", tier: "mid", price: 2790000, variant: "mATX - LGA1700 - DDR4" },
        { name: "Mainboard ASUS TUF Gaming B760M-PLUS WiFi D4", desc: "Bo mạch chủ Socket LGA1700 tản nhiệt dày cho Core i5 12400F 13400F RAM DDR4", platform: "LGA1700_DDR4", tier: "mid", price: 3990000, variant: "mATX - LGA1700 - DDR4" },
        { name: "Mainboard MSI MAG B760M MORTAR WiFi DDR4", desc: "Bo mạch chủ tầm trung cao cấp Socket LGA1700 hỗ trợ RAM DDR4", platform: "LGA1700_DDR4", tier: "mid", price: 4190000, variant: "mATX - LGA1700 - DDR4" },
        { name: "Mainboard ASRock B760M Pro RS/D4", desc: "Bo mạch chủ Socket LGA1700 thiết kế đẹp mắt cho CPU Intel Gen 12 13 và RAM DDR4", platform: "LGA1700_DDR4", tier: "mid", price: 2990000, variant: "mATX - LGA1700 - DDR4" },

        { name: "Mainboard MSI B760M Gaming Plus WiFi DDR5", desc: "Bo mạch chủ Socket LGA1700 hỗ trợ CPU Intel Gen 13 14 và RAM DDR5 6400MHz", platform: "LGA1700_DDR5", tier: "mid", price: 3890000, variant: "mATX - LGA1700 - DDR5" },
        { name: "Mainboard ASUS TUF Gaming B760M-PLUS WiFi II DDR5", desc: "Bo mạch chủ Socket LGA1700 cho Core i5 13600K 14600K dùng RAM DDR5", platform: "LGA1700_DDR5", tier: "high", price: 4490000, variant: "mATX - LGA1700 - DDR5" },
        { name: "Mainboard Gigabyte B760M AORUS ELITE AX DDR5", desc: "Bo mạch chủ gaming Socket LGA1700 VRM mạnh mẽ hỗ trợ RAM DDR5", platform: "LGA1700_DDR5", tier: "high", price: 4690000, variant: "mATX - LGA1700 - DDR5" },
        { name: "Mainboard MSI PRO Z790-P WiFi DDR5", desc: "Bo mạch chủ chipset Z790 Socket LGA1700 ép xung CPU Intel K-series và RAM DDR5", platform: "LGA1700_DDR5", tier: "high", price: 5690000, variant: "ATX - LGA1700 - DDR5" },
        { name: "Mainboard ASUS ROG Strix Z790-F Gaming WiFi II", desc: "Bo mạch chủ cao cấp Socket LGA1700 cho Core i7 14700K i9 14900K RAM DDR5", platform: "LGA1700_DDR5", tier: "high", price: 10990000, variant: "ATX - LGA1700 - DDR5" },
        { name: "Mainboard Gigabyte Z790 AORUS ELITE AX DDR5", desc: "Bo mạch chủ Z790 Socket LGA1700 16+1+2 Phases VRM tối ưu cho Intel Gen 14 DDR5", platform: "LGA1700_DDR5", tier: "high", price: 7290000, variant: "ATX - LGA1700 - DDR5" }
    ];

    for (const m of mainboards) {
        items.push({
            name: m.name,
            description: m.desc,
            categoryKey: "main",
            variantName: m.variant,
            sku: nextSku("MAIN"),
            price: m.price,
            stock: 40,
            mediaFileName: "main_demo.png",
            platform: m.platform,
            tier: m.tier
        });
    }

    // 3. RAM (24 items: 12 DDR4 + 12 DDR5)
    const rams: { name: string; desc: string; platform: PlatformTag; tier: "budget" | "mid" | "high"; price: number; variant: string }[] = [
        { name: "RAM Kingston Fury Beast 8GB DDR4 3200MHz", desc: "RAM PC DDR4 8GB Bus 3200MHz tản nhiệt thép tương thích Mainboard AM4 và LGA1700 DDR4", platform: "AM4_DDR4", tier: "budget", price: 550000, variant: "1x8GB - DDR4 - 3200MHz" },
        { name: "RAM Kingston Fury Beast 16GB (2x8GB) DDR4 3200MHz", desc: "Kit RAM PC DDR4 16GB Dual Channel Bus 3200MHz cho cấu hình gaming B450 B550 B760 DDR4", platform: "AM4_DDR4", tier: "mid", price: 1090000, variant: "2x8GB - DDR4 - 3200MHz" },
        { name: "RAM Corsair Vengeance LPX 16GB (2x8GB) DDR4 3200MHz", desc: "RAM PC DDR4 16GB low profile bền bỉ tương thích tốt Ryzen AM4 và Intel LGA1700 DDR4", platform: "LGA1700_DDR4", tier: "mid", price: 1150000, variant: "2x8GB - DDR4 - 3200MHz" },
        { name: "RAM Corsair Vengeance RGB Pro 16GB (2x8GB) DDR4 3600MHz", desc: "RAM PC DDR4 16GB LED RGB Bus 3600MHz tối ưu cho CPU AMD Ryzen 5000 và Intel", platform: "AM4_DDR4", tier: "mid", price: 1490000, variant: "2x8GB - DDR4 - 3600MHz RGB" },
        { name: "RAM G.Skill Ripjaws V 16GB (2x8GB) DDR4 3200MHz", desc: "RAM PC DDR4 16GB hiệu năng ổn định cho Mainboard H610 B660 B760 B550 DDR4", platform: "LGA1700_DDR4", tier: "budget", price: 1050000, variant: "2x8GB - DDR4 - 3200MHz" },
        { name: "RAM G.Skill Trident Z RGB 32GB (2x16GB) DDR4 3600MHz", desc: "Kit RAM DDR4 32GB cao cấp LED RGB cho cấu hình gaming và đồ họa AM4 LGA1700 DDR4", platform: "AM4_DDR4", tier: "high", price: 2390000, variant: "2x16GB - DDR4 - 3600MHz RGB" },
        { name: "RAM TeamGroup T-Force Delta RGB 16GB (2x8GB) DDR4 3200MHz", desc: "RAM DDR4 16GB tản nhiệt RGB góc rộng cho PC Gaming dùng Mainboard DDR4", platform: "LGA1700_DDR4", tier: "mid", price: 1250000, variant: "2x8GB - DDR4 - 3200MHz Trắng" },
        { name: "RAM ADATA XPG Spectrix D50 16GB (2x8GB) DDR4 3200MHz", desc: "RAM PC DDR4 16GB tản nhiệt kim loại RGB hỗ trợ XMP 2.0", platform: "LGA1700_DDR4", tier: "mid", price: 1190000, variant: "2x8GB - DDR4 - 3200MHz Xám" },
        { name: "RAM Lexar Thor 16GB (2x8GB) DDR4 3200MHz", desc: "RAM PC DDR4 16GB giá tốt tản nhiệt nhôm đen cho PC phổ thông", platform: "LGA1700_DDR4", tier: "budget", price: 950000, variant: "2x8GB - DDR4 - 3200MHz" },
        { name: "RAM Kingston Fury Renegade RGB 32GB (2x16GB) DDR4 3600MHz", desc: "RAM DDR4 32GB CL16 tốc độ cao cho Ryzen 7 5700X3D và Core i5 13400F", platform: "AM4_DDR4", tier: "high", price: 2490000, variant: "2x16GB - DDR4 - 3600MHz" },
        { name: "RAM PNY XLR8 Gaming Epic-X RGB 16GB (2x8GB) DDR4 3200MHz", desc: "RAM PC DDR4 16GB LED RGB rực rỡ tương thích mọi bo mạch chủ DDR4", platform: "AM4_DDR4", tier: "mid", price: 1120000, variant: "2x8GB - DDR4 - 3200MHz" },
        { name: "RAM Silicon Power XPOWER Turbine 8GB DDR4 3200MHz", desc: "Thanh RAM lẻ 8GB DDR4 3200MHz tiết kiệm chi phí cho PC văn phòng gaming nhẹ", platform: "LGA1700_DDR4", tier: "budget", price: 490000, variant: "1x8GB - DDR4 - 3200MHz" },

        { name: "RAM Kingston Fury Beast 16GB (2x8GB) DDR5 5600MHz", desc: "RAM PC DDR5 16GB chuẩn EXPO/XMP cho Mainboard B650 AM5 và B760 DDR5", platform: "AM5_DDR5", tier: "mid", price: 1890000, variant: "2x8GB - DDR5 - 5600MHz" },
        { name: "RAM Kingston Fury Beast RGB 32GB (2x16GB) DDR5 6000MHz", desc: "Kit RAM DDR5 32GB Bus 6000MHz AMD EXPO và Intel XMP 3.0", platform: "AM5_DDR5", tier: "high", price: 3190000, variant: "2x16GB - DDR5 - 6000MHz RGB" },
        { name: "RAM Corsair Vengeance RGB 32GB (2x16GB) DDR5 6000MHz CL30", desc: "RAM DDR5 32GB độ trễ thấp CL30 tối ưu hoàn hảo cho Ryzen 7000 AM5 và Intel Gen 14", platform: "AM5_DDR5", tier: "high", price: 3590000, variant: "2x16GB - DDR5 - 6000MHz CL30" },
        { name: "RAM G.Skill Trident Z5 Neo RGB 32GB (2x16GB) DDR5 6000MHz", desc: "RAM DDR5 32GB thiết kế chuyên biệt cho AMD Ryzen 7000/9000 Socket AM5", platform: "AM5_DDR5", tier: "high", price: 3690000, variant: "2x16GB - DDR5 - 6000MHz EXPO" },
        { name: "RAM G.Skill Trident Z5 RGB 32GB (2x16GB) DDR5 6400MHz", desc: "RAM DDR5 32GB tốc độ cao 6400MHz tối ưu cho Mainboard B760 Z790 Intel LGA1700", platform: "LGA1700_DDR5", tier: "high", price: 3790000, variant: "2x16GB - DDR5 - 6400MHz XMP" },
        { name: "RAM TeamGroup T-Force Delta RGB 32GB (2x16GB) DDR5 6000MHz", desc: "RAM DDR5 32GB LED RGB hỗ trợ cả Intel XMP 3.0 và AMD EXPO", platform: "LGA1700_DDR5", tier: "high", price: 3090000, variant: "2x16GB - DDR5 - 6000MHz Đen" },
        { name: "RAM ADATA XPG Lancer Blade RGB 32GB (2x16GB) DDR5 6000MHz", desc: "RAM DDR5 32GB low-profile không cấn tản khí lớn cho AM5 và LGA1700", platform: "AM5_DDR5", tier: "mid", price: 2990000, variant: "2x16GB - DDR5 - 6000MHz" },
        { name: "RAM Corsair Dominator Platinum RGB 32GB (2x16GB) DDR5 6200MHz", desc: "RAM DDR5 32GB dòng siêu cao cấp tản nhiệt DHX cho Z790 và X670E", platform: "LGA1700_DDR5", tier: "high", price: 4590000, variant: "2x16GB - DDR5 - 6200MHz" },
        { name: "RAM Lexar Ares RGB 32GB (2x16GB) DDR5 6400MHz", desc: "RAM DDR5 32GB Bus 6400MHz hiệu năng vượt trội cho PC Gaming thế hệ mới", platform: "LGA1700_DDR5", tier: "mid", price: 2950000, variant: "2x16GB - DDR5 - 6400MHz" },
        { name: "RAM G.Skill Ripjaws S5 32GB (2x16GB) DDR5 5600MHz", desc: "RAM DDR5 32GB tản nhiệt gọn gàng cho cấu hình Intel B760 Z790", platform: "LGA1700_DDR5", tier: "mid", price: 2690000, variant: "2x16GB - DDR5 - 5600MHz" },
        { name: "RAM Kingston Fury Renegade RGB 48GB (2x24GB) DDR5 7200MHz", desc: "RAM DDR5 48GB xung nhịp cực cao 7200MHz cho Mainboard Z790 cao cấp", platform: "LGA1700_DDR5", tier: "high", price: 5490000, variant: "2x24GB - DDR5 - 7200MHz" },
        { name: "RAM Crucial Pro 32GB (2x16GB) DDR5 5600MHz", desc: "RAM DDR5 32GB độ ổn định cao cho máy trạm đồ họa AM5 và LGA1700", platform: "AM5_DDR5", tier: "mid", price: 2590000, variant: "2x16GB - DDR5 - 5600MHz" }
    ];

    for (const r of rams) {
        items.push({
            name: r.name,
            description: r.desc,
            categoryKey: "ram",
            variantName: r.variant,
            sku: nextSku("RAM"),
            price: r.price,
            stock: 60,
            mediaFileName: "ram_demo.png",
            platform: r.platform,
            tier: r.tier
        });
    }

    // 4. GPU - Card màn hình (24 items)
    const gpus: { name: string; desc: string; tier: "budget" | "mid" | "high"; price: number; variant: string }[] = [
        { name: "VGA ASUS Dual Radeon RX 6600 8GB GDDR6", desc: "Card màn hình gaming Full HD quốc dân cần nguồn PSU 500W trở lên", tier: "budget", price: 5190000, variant: "8GB GDDR6 - Dual Fan" },
        { name: "VGA MSI GeForce GTX 1650 D6 Ventus XS OC 4GB", desc: "Card màn hình giá rẻ chơi mượt eSports tiết kiệm điện chỉ cần PSU 450W", tier: "budget", price: 3590000, variant: "4GB GDDR6 - Dual Fan" },
        { name: "VGA Gigabyte GeForce RTX 3050 Windforce OC 6GB", desc: "Card đồ họa NVIDIA RTX hỗ trợ Ray Tracing DLSS cho PC tầm trung PSU 450W", tier: "budget", price: 4790000, variant: "6GB GDDR6 - Dual Fan" },
        { name: "VGA ASRock Radeon RX 6600 Challenger D 8GB", desc: "Card màn hình 8GB VRAM chiến mọi game 1080p mượt mà với CPU i3 12100F Ryzen 5 5600", tier: "budget", price: 4990000, variant: "8GB GDDR6 - Dual Fan" },
        { name: "VGA MSI GeForce RTX 3060 Ventus 2X OC 12GB", desc: "Card màn hình 12GB VRAM cực kỳ phổ biến cho gaming và làm đồ họa AI cần PSU 550W", tier: "mid", price: 7390000, variant: "12GB GDDR6 - Dual Fan" },
        { name: "VGA ASUS Dual GeForce RTX 4060 OC Edition 8GB", desc: "Card màn hình kiến trúc Ada Lovelace DLSS 3 tiết kiệm điện cho PC gaming tầm trung", tier: "mid", price: 7990000, variant: "8GB GDDR6 - OC Edition" },
        { name: "VGA Gigabyte GeForce RTX 4060 Gaming OC 8GB", desc: "Card màn hình 3 quạt mát mẻ cho cấu hình Core i5 12400F 13400F Ryzen 5 7500F", tier: "mid", price: 8490000, variant: "8GB GDDR6 - 3 Fan" },
        { name: "VGA MSI GeForce RTX 4060 Gaming X 8GB", desc: "Card đồ họa dòng Gaming X tản nhiệt Twin Frozr 9 siêu êm ái", tier: "mid", price: 8690000, variant: "8GB GDDR6 - Twin Frozr 9" },
        { name: "VGA Sapphire Pulse Radeon RX 7600 8GB GDDR6", desc: "Card màn hình AMD RDNA 3 hiệu năng cao ở độ phân giải 1080p", tier: "mid", price: 6990000, variant: "8GB GDDR6 - Dual Fan" },
        { name: "VGA ASUS TUF Gaming GeForce RTX 4060 Ti OC 8GB", desc: "Card màn hình chiến mượt game 2K 1440p độ bền chuẩn TUF cần PSU 650W", tier: "mid", price: 11490000, variant: "8GB GDDR6 - 3 Fan" },
        { name: "VGA MSI GeForce RTX 4060 Ti Ventus 3X 16GB OC", desc: "Card đồ họa 16GB VRAM tối ưu cho dựng phim 3D và chạy mô hình AI cục bộ", tier: "high", price: 13290000, variant: "16GB GDDR6 - 3 Fan" },
        { name: "VGA Gigabyte Radeon RX 7700 XT Gaming OC 12GB", desc: "Card màn hình 12GB VRAM mạnh mẽ ở độ phân giải 2K cần nguồn PSU 700W", tier: "high", price: 11990000, variant: "12GB GDDR6 - 3 Fan" },
        { name: "VGA Sapphire Nitro+ Radeon RX 7800 XT 16GB", desc: "Card màn hình 16GB VRAM chiến max setting 2K đi cùng Ryzen 7 7800X3D", tier: "high", price: 14990000, variant: "16GB GDDR6 - Nitro+" },
        { name: "VGA ASUS Dual GeForce RTX 4070 Super OC 12GB", desc: "Card màn hình hiệu năng cao 2K Ray Tracing kết hợp hoàn hảo với CPU i5 14600K Ryzen 7", tier: "high", price: 16990000, variant: "12GB GDDR6X - Dual Fan" },
        { name: "VGA Gigabyte GeForce RTX 4070 Super Gaming OC 12GB", desc: "Card đồ họa 3 quạt tản nhiệt WindForce 3X yêu cầu nguồn PSU 750W chuẩn ATX 3.0", tier: "high", price: 17990000, variant: "12GB GDDR6X - 3 Fan" },
        { name: "VGA MSI GeForce RTX 4070 Ti Super Gaming X Slim 16GB", desc: "Card màn hình cao cấp 16GB GDDR6X chơi game 4K và đồ họa chuyên sâu", tier: "high", price: 23990000, variant: "16GB GDDR6X - Gaming X Slim" },
        { name: "VGA ASUS TUF Gaming GeForce RTX 4070 Ti Super 16GB", desc: "Card đồ họa cao cấp chuẩn TUF cho dàn máy i7 14700K Ryzen 7 7800X3D", tier: "high", price: 24990000, variant: "16GB GDDR6X - TUF 3 Fan" },
        { name: "VGA ASUS ROG Strix GeForce RTX 4080 Super OC 16GB", desc: "Card màn hình siêu phẩm ROG Strix chiến game 4K Ultra cần nguồn 850W ATX 3.0", tier: "high", price: 31990000, variant: "16GB GDDR6X - ROG Strix" },
        { name: "VGA Gigabyte GeForce RTX 4080 Super Aero OC 16GB", desc: "Card màn hình tông trắng sang trọng cho PC высоко cấp 4K", tier: "high", price: 29990000, variant: "16GB GDDR6X - Trắng Aero" },
        { name: "VGA ASUS ROG Strix GeForce RTX 4090 OC Edition 24GB", desc: "Card đồ họa mạnh nhất thế giới 24GB VRAM cho i9 14900K Ryzen 9 7950X PSU 1000W", tier: "high", price: 54990000, variant: "24GB GDDR6X - Flagship" },
        { name: "VGA Colorful iGame GeForce RTX 4060 Ultra W OC 8GB", desc: "Card màn hình màu trắngホロ그램 đẹp mắt cho PC gaming tầm trung", tier: "mid", price: 8290000, variant: "8GB GDDR6 - Ultra White" },
        { name: "VGA ZOTAC Gaming GeForce RTX 4060 Twin Edge 8GB", desc: "Card màn hình nhỏ gọn lắp vừa mọi vỏ case mATX ITX", tier: "mid", price: 7690000, variant: "8GB GDDR6 - Twin Edge" },
        { name: "VGA Galax GeForce RTX 4070 Super EX Gamer 1-Click OC 12GB", desc: "Card đồ họa 3 quạt LED ARGB hiệu năng vượt trội trong tầm giá", tier: "high", price: 16490000, variant: "12GB GDDR6X - ARGB" },
        { name: "VGA PowerColor Hellhound Radeon RX 6650 XT 8GB", desc: "Card màn hình hiệu năng cao hơn RX 6600 cho game thủ Full HD 165Hz", tier: "mid", price: 6190000, variant: "8GB GDDR6 - Dual Fan" }
    ];

    for (const g of gpus) {
        items.push({
            name: g.name,
            description: g.desc,
            categoryKey: "gpu",
            variantName: g.variant,
            sku: nextSku("GPU"),
            price: g.price,
            stock: 35,
            mediaFileName: "gpu_demo.png",
            platform: "UNIVERSAL",
            tier: g.tier
        });
    }

    // 5. PSU - Nguồn máy tính (18 items)
    const psus: { name: string; desc: string; tier: "budget" | "mid" | "high"; price: number; variant: string }[] = [
        { name: "Nguồn MSI MAG A550BN 550W 80 Plus Bronze", desc: "Nguồn máy tính 550W công suất thực phù hợp VGA GTX 1650 RX 6600 RTX 3050", tier: "budget", price: 1190000, variant: "550W - 80 Plus Bronze" },
        { name: "Nguồn Corsair CX550 550W 80 Plus Bronze", desc: "Nguồn PC 550W thương hiệu Mỹ bền bỉ cho dàn máy i3 12100F Ryzen 5 5500", tier: "budget", price: 1290000, variant: "550W - 80 Plus Bronze" },
        { name: "Nguồn DeepCool PK550D 550W 80 Plus Bronze", desc: "Nguồn máy tính 550W dây cáp dẹp đen dễ đi dây cho PC phổ thông", tier: "budget", price: 1090000, variant: "550W - 80 Plus Bronze" },
        { name: "Nguồn Cooler Master MWE 550 Bronze V2 550W", desc: "Nguồn PC 550W mạch DC-to-DC ổn định cho cấu hình tầm trung", tier: "budget", price: 1250000, variant: "550W - 80 Plus Bronze" },
        { name: "Nguồn Xigmatek X-Power III 500 450W", desc: "Nguồn PC giá rẻ cho máy văn phòng và card đồ họa không nguồn phụ", tier: "budget", price: 690000, variant: "450W - Standard" },
        { name: "Nguồn MSI MAG A650BN 650W 80 Plus Bronze", desc: "Nguồn PC 650W quốc dân cân tốt RTX 3060 RTX 4060 RX 7600", tier: "mid", price: 1390000, variant: "650W - 80 Plus Bronze" },
        { name: "Nguồn Corsair CV650 650W 80 Plus Bronze", desc: "Nguồn máy tính 650W ổn định cho dàn PC Gaming Core i5 Ryzen 5", tier: "mid", price: 1550000, variant: "650W - 80 Plus Bronze" },
        { name: "Nguồn Cooler Master MWE 650 Bronze V2 650W", desc: "Nguồn PC 650W quạt HDB êm ái cho cấu hình RTX 4060 RTX 4060 Ti", tier: "mid", price: 1490000, variant: "650W - 80 Plus Bronze" },
        { name: "Nguồn DeepCool PK650D 650W 80 Plus Bronze", desc: "Nguồn 650W hiệu suất 85% cho PC Gaming tầm trung", tier: "mid", price: 1350000, variant: "650W - 80 Plus Bronze" },
        { name: "Nguồn ASUS TUF Gaming 650W Bronze", desc: "Nguồn máy tính 650W linh kiện chuẩn quân đội bảo hành 6 năm", tier: "mid", price: 1790000, variant: "650W - 80 Plus Bronze" },
        { name: "Nguồn MSI MAG A750GL PCIE5 750W 80 Plus Gold", desc: "Nguồn Full Modular 750W chuẩn ATX 3.0 có cáp 12VHPWR cho RTX 4070 Super", tier: "high", price: 2490000, variant: "750W - Gold Full Modular ATX 3.0" },
        { name: "Nguồn Corsair RM750e 750W 80 Plus Gold ATX 3.0", desc: "Nguồn cao cấp 750W Full Modular siêu êm cho RTX 4070 Super RX 7800 XT", tier: "high", price: 2790000, variant: "750W - Gold Full Modular" },
        { name: "Nguồn Cooler Master MWE Gold 750 V2 Full Modular", desc: "Nguồn 750W chuẩn 80 Plus Gold tụ Nhật bền bỉ cho PC cao cấp", tier: "high", price: 2390000, variant: "750W - Gold Full Modular" },
        { name: "Nguồn DeepCool PN750M 750W 80 Plus Gold ATX 3.1", desc: "Nguồn 750W chuẩn ATX 3.1 mới nhất hỗ trợ GPU thế hệ mới", tier: "high", price: 2350000, variant: "750W - Gold Full Modular" },
        { name: "Nguồn Corsair RM850e 850W 80 Plus Gold ATX 3.0", desc: "Nguồn 850W Full Modular cho cấu hình i7 14700K Ryzen 7 7800X3D RTX 4080 Super", tier: "high", price: 3290000, variant: "850W - Gold Full Modular" },
        { name: "Nguồn MSI MAG A850GL PCIE5 850W 80 Plus Gold", desc: "Nguồn 850W hỗ trợ PCIe 5.0 16-pin công suất thực cho PC Hi-End", tier: "high", price: 2990000, variant: "850W - Gold Full Modular" },
        { name: "Nguồn ASUS ROG Strix 850W Gold Aura Edition", desc: "Nguồn cao cấp 850W tản nhiệt ROG lớn kèm đèn Aura Sync", tier: "high", price: 4290000, variant: "850W - Gold Aura Edition" },
        { name: "Nguồn Corsair RM1000e 1000W 80 Plus Gold ATX 3.0", desc: "Nguồn 1000W công suất lớn cho RTX 4090 và CPU Core i9 14900K Ryzen 9 7950X", tier: "high", price: 4590000, variant: "1000W - Gold Full Modular" }
    ];

    for (const p of psus) {
        items.push({
            name: p.name,
            description: p.desc,
            categoryKey: "psu",
            variantName: p.variant,
            sku: nextSku("PSU"),
            price: p.price,
            stock: 45,
            mediaFileName: "psu_demo.png",
            platform: "UNIVERSAL",
            tier: p.tier
        });
    }

    // 6. SSD - Ổ cứng (18 items)
    const ssds: { name: string; desc: string; tier: "budget" | "mid" | "high"; price: number; variant: string }[] = [
        { name: "SSD Kingston NV2 500GB M.2 PCIe Gen4 x4 NVMe", desc: "Ổ cứng SSD M.2 NVMe 500GB tốc độ đọc 3500MB/s quốc dân cho mọi PC", tier: "budget", price: 990000, variant: "500GB - M.2 NVMe Gen4" },
        { name: "SSD WD Blue SN580 500GB M.2 PCIe Gen4 NVMe", desc: "Ổ cứng SSD 500GB tốc độ 4000MB/s bền bỉ cho cài Win và game", tier: "budget", price: 1150000, variant: "500GB - M.2 NVMe Gen4" },
        { name: "SSD Crucial P3 Plus 500GB M.2 PCIe Gen4 NVMe", desc: "Ổ cứng SSD 500GB tốc độ cao tương thích mọi Mainboard B450 B550 B650 B760", tier: "budget", price: 1090000, variant: "500GB - M.2 NVMe Gen4" },
        { name: "SSD Lexar NM620 512GB M.2 PCIe Gen3 x4 NVMe", desc: "Ổ cứng SSD NVMe 512GB giá rẻ tốc độ 3300MB/s cho PC phổ thông", tier: "budget", price: 890000, variant: "512GB - M.2 NVMe Gen3" },
        { name: "SSD Samsung 980 500GB M.2 PCIe NVMe", desc: "Ổ cứng SSD Samsung 500GB độ bền vượt trội công nghệ HMB", tier: "mid", price: 1390000, variant: "500GB - M.2 NVMe" },
        { name: "SSD Kingston NV3 1TB M.2 PCIe Gen4 x4 NVMe", desc: "Ổ cứng SSD 1TB thế hệ mới tốc độ 6000MB/s cho PC Gaming tầm trung", tier: "mid", price: 1690000, variant: "1TB - M.2 NVMe Gen4" },
        { name: "SSD WD Black SN770 1TB M.2 PCIe Gen4 NVMe", desc: "Ổ cứng SSD Gaming 1TB tốc độ 5150MB/s tối ưu thời gian load game", tier: "mid", price: 2090000, variant: "1TB - M.2 NVMe Gen4" },
        { name: "SSD Crucial P3 Plus 1TB M.2 PCIe Gen4 NVMe", desc: "Ổ cứng SSD 1TB dung lượng lớn lưu trữ thoải mái các tựa game AAA", tier: "mid", price: 1790000, variant: "1TB - M.2 NVMe Gen4" },
        { name: "SSD Lexar NM790 1TB M.2 PCIe Gen4 x4 NVMe", desc: "Ổ cứng SSD 1TB tốc độ siêu nhanh 7400MB/s cho PC Gaming và PS5", tier: "mid", price: 2150000, variant: "1TB - M.2 NVMe 7400MB/s" },
        { name: "SSD TeamGroup MP44L 1TB M.2 PCIe Gen4 NVMe", desc: "Ổ cứng SSD 1TB có lá tản nhiệt Graphene mỏng mát mẻ", tier: "mid", price: 1750000, variant: "1TB - M.2 NVMe Gen4" },
        { name: "SSD ADATA Legend 850 Lite 1TB M.2 PCIe Gen4", desc: "Ổ cứng SSD 1TB kèm heatsink nhôm cho Mainboard B650 B760", tier: "mid", price: 1850000, variant: "1TB - M.2 NVMe Gen4" },
        { name: "SSD Samsung 990 EVO 1TB M.2 PCIe Gen4/Gen5", desc: "Ổ cứng SSD Samsung 1TB tiết kiệm điện tốc độ 5000MB/s", tier: "mid", price: 2390000, variant: "1TB - M.2 NVMe" },
        { name: "SSD Samsung 990 PRO 1TB M.2 PCIe Gen4 NVMe", desc: "Ổ cứng SSD flagship 1TB có DRAM Cache tốc độ 7450MB/s cho dựng phim 4K", tier: "high", price: 2990000, variant: "1TB - M.2 NVMe DRAM Cache" },
        { name: "SSD Kingston KC3000 1TB M.2 PCIe Gen4 NVMe", desc: "Ổ cứng SSD cao cấp 1TB có DRAM Cache tốc độ 7000MB/s cực bền", tier: "high", price: 2590000, variant: "1TB - M.2 NVMe 7000MB/s" },
        { name: "SSD WD Black SN850X 1TB M.2 PCIe Gen4 NVMe", desc: "Ổ cứng SSD chuyên game cao cấp tốc độ 7300MB/s có Game Mode 2.0", tier: "high", price: 2790000, variant: "1TB - M.2 NVMe 7300MB/s" },
        { name: "SSD Samsung 990 PRO 2TB M.2 PCIe Gen4 NVMe", desc: "Ổ cứng SSD 2TB siêu tốc độ cho Workstation và PC Hi-End", tier: "high", price: 4990000, variant: "2TB - M.2 NVMe DRAM Cache" },
        { name: "SSD Kingston KC3000 2TB M.2 PCIe Gen4 NVMe", desc: "Ổ cứng SSD 2TB tốc độ đọc ghi 7000MB/s lưu trữ project đồ họa lớn", tier: "high", price: 4390000, variant: "2TB - M.2 NVMe 7000MB/s" },
        { name: "SSD Corsair MP600 PRO LPX 2TB M.2 PCIe Gen4", desc: "Ổ cứng SSD 2TB tích hợp tản nhiệt nhôm dày cho Z790 X670E", tier: "high", price: 4590000, variant: "2TB - Có Heatsink" }
    ];

    for (const s of ssds) {
        items.push({
            name: s.name,
            description: s.desc,
            categoryKey: "ssd",
            variantName: s.variant,
            sku: nextSku("SSD"),
            price: s.price,
            stock: 60,
            mediaFileName: "ssd_demo.png",
            platform: "UNIVERSAL",
            tier: s.tier
        });
    }

    // 7. Case - Vỏ máy tính (16 items)
    const cases: { name: string; desc: string; tier: "budget" | "mid" | "high"; price: number; variant: string }[] = [
        { name: "Vỏ Case Xigmatek Gaming X 3FX (3 Fan RGB)", desc: "Vỏ thùng máy tính ATX mặt lưới thoáng khí tặng kèm 3 quạt RGB", tier: "budget", price: 790000, variant: "Mid Tower - Đen - 3 Fan RGB" },
        { name: "Vỏ Case MIK Morax 3FA Đen (3 Fan ARGB)", desc: "Vỏ case mATX kính cường lực nhỏ gọn phù hợp Mainboard B450M B550M B760M", tier: "budget", price: 750000, variant: "mATX - Đen - 3 Fan ARGB" },
        { name: "Vỏ Case Kenoo Esport MK200 Đen", desc: "Vỏ case mATX bể cá 2 mặt kính cường lực giá rẻ", tier: "budget", price: 690000, variant: "mATX - Kính Vô Cực" },
        { name: "Vỏ Case Montech AIR 100 ARGB Đen", desc: "Vỏ case mATX mặt lưới siêu thoáng kèm 4 quạt ARGB và Hub điều khiển", tier: "mid", price: 1350000, variant: "mATX - Đen - 4 Fan ARGB" },
        { name: "Vỏ Case Montech AIR 100 ARGB Trắng", desc: "Vỏ case mATX tông trắng tinh tế kèm 4 quạt ARGB", tier: "mid", price: 1450000, variant: "mATX - Trắng - 4 Fan ARGB" },
        { name: "Vỏ CaseMontech SKY TWO Đen", desc: "Vỏ case bể cá ATX 2 mặt kính liền mạch kèm 4 quạt ARGB", tier: "mid", price: 1890000, variant: "Mid Tower - Đen - 4 Fan" },
        { name: "Vỏ Case DeepCool CH370 Đen", desc: "Vỏ case mATX thiết kế tối giản có giá đỡ VGA tích hợp", tier: "mid", price: 1290000, variant: "mATX - Đen" },
        { name: "Vỏ Case Corsair 4000D Airflow Đen", desc: "Vỏ case Mid Tower quốc dân tối ưu luồng gió cho PC Gaming và Workstation", tier: "mid", price: 2190000, variant: "ATX Mid Tower - Đen" },
        { name: "Vỏ Case Corsair 4000D Airflow Trắng", desc: "Vỏ case Mid Tower màu trắng hỗ trợ tản nước AIO 360mm", tier: "mid", price: 2290000, variant: "ATX Mid Tower - Trắng" },
        { name: "Vỏ Case NZXT H5 Flow RGB Đen", desc: "Vỏ case ATX có quạt đáy thổi chéo trực tiếp làm mát GPU", tier: "high", price: 2590000, variant: "ATX Mid Tower - Đen" },
        { name: "Vỏ Case NZXT H6 Flow Trắng", desc: "Vỏ case bể cá 2 buồng kính panorama khoe trọn linh kiện RGB", tier: "high", price: 2890000, variant: "ATX Dual-Chamber - Trắng" },
        { name: "Vỏ Case Lian Li Lancool 216 RGB Đen", desc: "Vỏ case airflow đỉnh cao với 2 quạt trước 160mm ARGB siêu mát", tier: "high", price: 2490000, variant: "ATX Mid Tower - 2 Fan 160mm" },
        { name: "Vỏ Case Lian Li O11 Dynamic EVO Đen", desc: "Vỏ case bể cá huyền thoại cho dàn PC Hi-End RTX 4080 RTX 4090", tier: "high", price: 3990000, variant: "ATX Dual-Chamber - Đen" },
        { name: "Vỏ Case ASUS Prime AP201 Mesh Trắng", desc: "Vỏ case mATX toàn bộ mặt lưới kim loại hỗ trợ AIO 360mm và nguồn ATX", tier: "mid", price: 1790000, variant: "mATX Mesh - Trắng" },
        { name: "Vỏ Case ASUS TUF Gaming GT302 ARGB", desc: "Vỏ case ATX đi kèm 4 quạt dày 28mm lưu lượng gió cực lớn", tier: "high", price: 3290000, variant: "ATX - 4 Fan 140mm ARGB" },
        { name: "Vỏ Case Hyte Y60 Đen Đỏ", desc: "Vỏ case kính 3 mặt góc nhìn toàn cảnh kèm dây Riser PCIe 4.0 dựng dọc VGA", tier: "high", price: 4690000, variant: "ATX Panorama - Kèm Riser" }
    ];

    for (const cs of cases) {
        items.push({
            name: cs.name,
            description: cs.desc,
            categoryKey: "case",
            variantName: cs.variant,
            sku: nextSku("CASE"),
            price: cs.price,
            stock: 30,
            mediaFileName: "case_demo.png",
            platform: "UNIVERSAL",
            tier: cs.tier
        });
    }

    // 8. Cooler - Tản nhiệt CPU (14 items)
    const coolers: { name: string; desc: string; tier: "budget" | "mid" | "high"; price: number; variant: string }[] = [
        { name: "Tản nhiệt khí DeepCool AG400 LED", desc: "Tản nhiệt khí 4 ống đồng cho CPU Intel LGA1700 và AMD AM4 AM5", tier: "budget", price: 490000, variant: "4 Ống Đồng - Fan 120mm" },
        { name: "Tản nhiệt khí ID-Cooling SE-214-XT ARGB", desc: "Tản nhiệt khí quốc dân LED ARGB cho Core i5 12400F Ryzen 5 5600", tier: "budget", price: 450000, variant: "4 Ống Đồng - ARGB Đen" },
        { name: "Tản nhiệt khí Thermalright Assassin X 120 Refined SE", desc: "Tản khí hiệu năng cao giá rẻ tương thích AM4 AM5 LGA1700", tier: "budget", price: 420000, variant: "4 Ống Đồng - ARGB" },
        { name: "Tản nhiệt khí Thermalright Peerless Assassin 120 SE ARGB", desc: "Tản nhiệt khí tháp đôi 6 ống đồng cân tốt i5 13600K Ryzen 7 7700X", tier: "mid", price: 890000, variant: "Tháp Đôi 6 Ống Đồng - ARGB" },
        { name: "Tản nhiệt khí Thermalright Phantom Spirit 120 SE", desc: "Tản nhiệt khí tháp đôi 7 ống đồng hiệu năng ngang tản nước 240mm", tier: "mid", price: 990000, variant: "Tháp Đôi 7 Ống Đồng" },
        { name: "Tản nhiệt khí DeepCool AK400 Digital", desc: "Tản nhiệt khí có màn hình hiển thị nhiệt độ CPU thời gian thực", tier: "mid", price: 890000, variant: "Màn Hình Digital - Đen" },
        { name: "Tản nhiệt khí DeepCool AK620 Digital", desc: "Tản nhiệt khí tháp đôi cao cấp kèm màn hình hiển thị nhiệt độ", tier: "mid", price: 1590000, variant: "Tháp Đôi Digital - Đen" },
        { name: "Tản nhiệt nước AIO Thermalright Aqua Elite 240 V3 ARGB", desc: "Tản nhiệt nước 240mm giá tốt cho CPU tầm trung và cao cấp", tier: "mid", price: 1290000, variant: "Rad 240mm - ARGB Đen" },
        { name: "Tản nhiệt nước AIO DeepCool LE520 240mm ARGB", desc: "Tản nhiệt nước AIO 240mm chống rò rỉ Anti-Leak cho AM5 và LGA1700", tier: "mid", price: 1590000, variant: "Rad 240mm - ARGB" },
        { name: "Tản nhiệt nước AIO Thermalright Frozen Notte 360 ARGB", desc: "Tản nhiệt nước 360mm 3 quạt làm mát tối ưu cho i7 14700K Ryzen 7 7800X3D", tier: "high", price: 1990000, variant: "Rad 360mm - ARGB" },
        { name: "Tản nhiệt nước AIO DeepCool LT720 360mm", desc: "Tản nhiệt nước 360mm mặt gương vô cực hiệu năng cực cao cho i9 14900K", tier: "high", price: 2890000, variant: "Rad 360mm - Gương Vô Cực" },
        { name: "Tản nhiệt nước AIO Corsair iCUE H150i Elite Capellix XT 360mm", desc: "Tản nhiệt nước cao cấp 360mm bơm LED Capellix cực sáng", tier: "high", price: 4290000, variant: "Rad 360mm - iCUE RGB" },
        { name: "Tản nhiệt nước AIO NZXT Kraken Elite 360 RGB", desc: "Tản nhiệt nước 360mm có màn hình LCD tùy chỉnh ảnh GIF", tier: "high", price: 6490000, variant: "Rad 360mm - Màn Hình LCD" },
        { name: "Tản nhiệt khí Noctua NH-D15 chromax.black", desc: "Tản nhiệt khí huyền thoại siêu êm độ bền 10 năm", tier: "high", price: 2890000, variant: "Tháp Đôi - Chromax Black" }
    ];

    for (const cl of coolers) {
        items.push({
            name: cl.name,
            description: cl.desc,
            categoryKey: "cooler",
            variantName: cl.variant,
            sku: nextSku("COOLER"),
            price: cl.price,
            stock: 40,
            mediaFileName: "cooler_demo.png",
            platform: "UNIVERSAL",
            tier: cl.tier
        });
    }

    // 9. Mouse - Chuột máy tính (18 items)
    const mice: { name: string; desc: string; tier: "budget" | "mid" | "high"; price: number; variant: string }[] = [
        { name: "Chuột Gaming Logitech G102 Lightsync RGB Đen", desc: "Chuột chơi game quốc dân mắt đọc 8000 DPI LED RGB đi kèm bàn phím cơ", tier: "budget", price: 390000, variant: "Có Dây - Đen - RGB" },
        { name: "Chuột Gaming Logitech G102 Lightsync RGB Trắng", desc: "Chuột gaming G102 màu trắng trẻ trung độ bền cao", tier: "budget", price: 390000, variant: "Có Dây - Trắng - RGB" },
        { name: "Chuột Không Dây Logitech G304 Lightspeed Đen", desc: "Chuột gaming không dây cảm biến HERO 12000 DPI pin 250 giờ", tier: "budget", price: 790000, variant: "Wireless Lightspeed - Đen" },
        { name: "Chuột Gaming Razer DeathAdder Essential", desc: "Chuột công thái học form cầm ôm tay cho game thủ FPS MOBA", tier: "budget", price: 450000, variant: "Có Dây - Đen" },
        { name: "Chuột Gaming Razer Cobra Lightweight RGB", desc: "Chuột gaming siêu nhẹ 58g switch quang học thế hệ 3", tier: "mid", price: 890000, variant: "Có Dây - 58g - Chroma RGB" },
        { name: "Chuột Không Dây Razer Orochi V2", desc: "Chuột gaming không dây nhỏ gọn hỗ trợ cả 2.4GHz và Bluetooth", tier: "mid", price: 1090000, variant: "Dual Wireless - Đen" },
        { name: "Chuột Gaming Razer DeathAdder V3", desc: "Chuột eSports chuyên nghiệp cảm biến Focus Pro 30K siêu nhẹ 59g", tier: "mid", price: 1490000, variant: "Có Dây 8KHz - 59g" },
        { name: "Chuột Không Dây Logitech G502 X Plus Lightspeed RGB", desc: "Chuột gaming đa năng 13 nút lập trình switch lai quang cơ Lightforce", tier: "high", price: 3190000, variant: "Wireless RGB - Đen" },
        { name: "Chuột Không Dây Logitech G Pro X Superlight 2", desc: "Chuột thi đấu eSports đỉnh cao 60g cảm biến HERO 2 44000 DPI", tier: "high", price: 3390000, variant: "Wireless 60g - Trắng" },
        { name: "Chuột Không Dây Razer Viper V3 Pro", desc: "Chuột không dây siêu nhẹ 54g Polling Rate 8000Hz cho tuyển thủ FPS", tier: "high", price: 3690000, variant: "Wireless 8KHz - Đen" },
        { name: "Chuột Không Dây Razer DeathAdder V3 Pro", desc: "Chuột công thái học không dây siêu nhẹ 63g đỉnh cao cho CS2 Valorant", tier: "high", price: 3190000, variant: "Wireless - Đen" },
        { name: "Chuột Không Dây Pulsar X2V2 Wireless", desc: "Chuột gaming đối xứng siêu nhẹ 53g mắt đọc PAW3395", tier: "high", price: 2190000, variant: "Wireless PAW3395 - Đen" },
        { name: "Chuột Không Dây Lamzu Atlantis Mini 4K", desc: "Chuột gaming siêu nhẹ 49g mắt đọc PAW3395 hỗ trợ 4000Hz", tier: "high", price: 2290000, variant: "Wireless 4K - Trắng" },
        { name: "Chuột Không Dây VGN Dragonfly F1 Pro Max", desc: "Chuột không dây quốc dân mắt đọc PAW3395 pin 130 giờ", tier: "mid", price: 1050000, variant: "3 Mode Wireless - Đen" },
        { name: "Chuột Không Dây Attack Shark X3 PAW3395", desc: "Chuột không dây 3 mode siêu nhẹ 49g cảm biến PAW3395 giá tốt", tier: "budget", price: 650000, variant: "3 Mode - 49g - Trắng" },
        { name: "Chuột Gaming SteelSeries Prime Mini Wireless", desc: "Chuột không dây switch từ tính Prestige OM độ bền 100 triệu lần nhấn", tier: "mid", price: 1590000, variant: "Wireless - Đen" },
        { name: "Chuột Gaming ASUS ROG Harpe Ace Aim Lab Edition", desc: "Chuột không dây siêu nhẹ 54g hợp tác phát triển cùng Aim Lab", tier: "high", price: 2690000, variant: "Wireless 54g - Đen" },
        { name: "Chuột Công Thái Học Logitech MX Master 3S", desc: "Chuột không dây cao cấp cho lập trình viên và thiết kế đồ họa", tier: "high", price: 2390000, variant: "Bluetooth/Bolt - Graphite" }
    ];

    for (const mo of mice) {
        items.push({
            name: mo.name,
            description: mo.desc,
            categoryKey: "mouse",
            variantName: mo.variant,
            sku: nextSku("MOUSE"),
            price: mo.price,
            stock: 50,
            mediaFileName: "mouse_demo.png",
            platform: "UNIVERSAL",
            tier: mo.tier
        });
    }

    // 10. Keyboard - Bàn phím cơ (18 items)
    const keyboards: { name: string; desc: string; tier: "budget" | "mid" | "high"; price: number; variant: string }[] = [
        { name: "Bàn phím cơ DareU EK87 V2 LED Rainbow", desc: "Bàn phím cơ TKL 87 phím switch DareU bền bỉ giá rẻ cho học sinh sinh viên", tier: "budget", price: 490000, variant: "TKL 87 Phím - Red Switch" },
        { name: "Bàn phím cơ E-DRA EK387L RGB", desc: "Bàn phím cơ TKL Huano Switch gõ êm cho phòng máy và góc gaming", tier: "budget", price: 590000, variant: "TKL 87 Phím - Brown Switch" },
        { name: "Bàn phím cơ Không Dây Xinmeng M75 Pro", desc: "Bàn phím cơ 75% mạch xuôi Gasket Mount 3 mode kết nối âm gõ trầm ấm", tier: "budget", price: 890000, variant: "75% 3 Mode - Linear Switch" },
        { name: "Bàn phím cơ Aula F75 3 Mode Wireless RGB", desc: "Bàn phím cơ quốc dân layout 75% có núm xoay Gasket Mount Reaper Switch cực êm", tier: "mid", price: 1190000, variant: "75% 3 Mode - Reaper Switch" },
        { name: "Bàn phím cơ Aula F87 Pro 3 Mode Wireless", desc: "Bàn phím cơ TKL 87 phím lót sẵn full foam âm gõ nổ giòn", tier: "mid", price: 1090000, variant: "TKL 3 Mode - Greywood V4" },
        { name: "Bàn phím cơ Akko 5075B Plus Không Dây RGB", desc: "Bàn phím cơ 75% Hotswap 5 pin Cream Yellow Switch Pro", tier: "mid", price: 1690000, variant: "75% 3 Mode - Cream Yellow" },
        { name: "Bàn phím cơ Akko 3098B Multi-modes", desc: "Bàn phím cơ layout 98 phím có cụm phím số tiện lợi cho làm việc và chơi game", tier: "mid", price: 1890000, variant: "98 Phím 3 Mode - Jelly Pink" },
        { name: "Bàn phím cơ Keychron K8 Pro QMK/VIA Nhôm", desc: "Bàn phím cơ không dây khung nhôm hỗ trợ cả Windows và macOS", tier: "mid", price: 2290000, variant: "TKL Khung Nhôm - Red Switch" },
        { name: "Bàn phím cơ Rainy75 Nhôm CNC 3 Mode", desc: "Bàn phím cơ custom nhôm nguyên khối CNC âm gõ mưa rơi tuyệt đỉnh", tier: "high", price: 2490000, variant: "Nhôm CNC - HMX Violet Switch" },
        { name: "Bàn phím cơ MonsGeek M1W V3 Nhôm 3 Mode", desc: "Bàn phím cơ nhôm CNC 75% có núm xoay pin 6000mAh", tier: "high", price: 2590000, variant: "Nhôm 75% - Đen" },
        { name: "Bàn phím cơ Logitech G Pro X TKL Lightspeed", desc: "Bàn phím cơ không dây thi đấu eSports đồng bộ hoàn hảo với chuột Logitech G Pro", tier: "high", price: 3790000, variant: "Wireless TKL - Tactile" },
        { name: "Bàn phím cơ Razer BlackWidow V4 75%", desc: "Bàn phím cơ gaming Razer hỗ trợ Hotswap switch và đệm tay từ tính", tier: "high", price: 4290000, variant: "75% Hotswap - Orange Switch" },
        { name: "Bàn phím từ tính Wooting 60HE+ Rapid Trigger", desc: "Bàn phím switch nam châm Hall Effect có Rapid Trigger đỉnh cao cho Valorant CS2", tier: "high", price: 5490000, variant: "60% Magnetic - Lekker Switch" },
        { name: "Bàn phím từ tính DrunkDeer A75 Rapid Trigger", desc: "Bàn phím cơ switch từ tính 75% phản hồi tức thì cho game thủ FPS", tier: "high", price: 2790000, variant: "75% Magnetic Switch - Đen" },
        { name: "Bàn phím cơ ASUS ROG Azoth Wireless OLED", desc: "Bàn phím cơ gaming cao cấp có màn hình OLED và Gasket Mount", tier: "high", price: 5690000, variant: "75% Wireless OLED - ROG NX" },
        { name: "Bàn phím cơ Corsair K70 CORE RGB", desc: "Bàn phím cơ Fullsize khung nhôm núm xoay đa phương tiện Switch MLX Red", tier: "mid", price: 2190000, variant: "Fullsize - MLX Red Switch" },
        { name: "Bàn phím cơ FL-Esports CMK75 Wireless", desc: "Bàn phím cơ 75% có màn hình TFT hiển thị giờ và dung lượng pin", tier: "high", price: 2690000, variant: "75% Có Màn Hình - Ice Mint" },
        { name: "Bàn phím cơ Royal Kludge RK R75", desc: "Bàn phím cơ Gasket Mount giá tốt có núm xoay âm lượng", tier: "budget", price: 850000, variant: "75% Có Dây - Chartreuse Switch" }
    ];

    for (const kb of keyboards) {
        items.push({
            name: kb.name,
            description: kb.desc,
            categoryKey: "keyboard",
            variantName: kb.variant,
            sku: nextSku("KB"),
            price: kb.price,
            stock: 45,
            mediaFileName: "keyboard_demo.png",
            platform: "UNIVERSAL",
            tier: kb.tier
        });
    }

    // 11. Monitor - Màn hình máy tính (16 items) -> Tổng cộng: 24+24+24+24+18+18+16+14+18+18+16 = 214 sản phẩm!
    const monitors: { name: string; desc: string; tier: "budget" | "mid" | "high"; price: number; variant: string }[] = [
        { name: "Màn hình MSI PRO MP251 24.5 inch IPS 100Hz", desc: "Màn hình văn phòng và giải trí 24.5 inch Full HD tấm nền IPS 100Hz chống mỏi mắt", tier: "budget", price: 2190000, variant: "24.5 inch - FHD - IPS 100Hz" },
        { name: "Màn hình LG 24MR400-B 24 inch IPS 100Hz", desc: "Màn hình 24 inch viền mỏng 3 cạnh tấm nền IPS màu sắc chuẩn xác", tier: "budget", price: 2290000, variant: "24 inch - FHD - IPS 100Hz" },
        { name: "Màn hình ASUS VY249HGR 24 inch IPS 120Hz", desc: "Màn hình 24 inch Full HD tần số quét 120Hz mượt mà giá rẻ", tier: "budget", price: 2390000, variant: "24 inch - FHD - IPS 120Hz" },
        { name: "Màn hình AOC 24G4E 24 inch Fast IPS 180Hz 0.5ms", desc: "Màn hình gaming 24 inch 180Hz quốc dân cho card màn hình RX 6600 RTX 3060 RTX 4060", tier: "mid", price: 2990000, variant: "24 inch - FHD - Fast IPS 180Hz" },
        { name: "Màn hìnhLG UltraGear 24GS60F-B 24 inch IPS 180Hz", desc: "Màn hình gaming LG UltraGear 180Hz 1ms hỗ trợ G-Sync Compatible", tier: "mid", price: 3390000, variant: "24 inch - FHD - IPS 180Hz" },
        { name: "Màn hình ASUS TUF Gaming VG249Q3A 24 inch Fast IPS 180Hz", desc: "Màn hình gaming chuẩn eSports 99% sRGB ELMB chống nhòe chuyển động", tier: "mid", price: 3290000, variant: "24 inch - FHD - 180Hz" },
        { name: "Màn hình ViewSonic VX2479-HD-PRO 24 inch IPS 180Hz", desc: "Màn hình gaming tần số quét cao giá tốt cho game thủ FPS", tier: "budget", price: 2790000, variant: "24 inch - FHD - 180Hz" },
        { name: "Màn hình MSI G274QPF E2 27 inch 2K Rapid IPS 180Hz", desc: "Màn hình gaming 27 inch độ phân giải 2K QHD 180Hz chân đế xoay dọc", tier: "mid", price: 5490000, variant: "27 inch - 2K QHD - 180Hz" },
        { name: "Màn hình LG UltraGear 27GR75Q-B 27 inch 2K IPS 165Hz", desc: "Màn hình gaming 27 inch 2K sắc nét kết hợp hoàn hảo với RTX 4060 Ti RTX 4070 Super", tier: "mid", price: 5790000, variant: "27 inch - 2K QHD - 165Hz" },
        { name: "Màn hình ASUS TUF Gaming VG27AQ3A 27 inch 2K Fast IPS 180Hz", desc: "Màn hình 27 inch 2K 130% sRGB cho cả chơi game và chỉnh sửa ảnh", tier: "mid", price: 5890000, variant: "27 inch - 2K QHD - 180Hz" },
        { name: "Màn hình Gigabyte M27Q Advanced 27 inch 2K IPS 170Hz KVM", desc: "Màn hình 27 inch 2K tích hợp bộ chuyển mạch KVM dùng chung phím chuột cho PC và Laptop", tier: "mid", price: 5990000, variant: "27 inch - 2K - KVM Switch" },
        { name: "Màn hình Đồ Họa ASUS ProArt PA278QV 27 inch 2K IPS", desc: "Màn hình chuyên đồ họa cân màu sẵn tại nhà máy Delta E < 2", tier: "high", price: 7290000, variant: "27 inch - 2K - Chuẩn Màu ProArt" },
        { name: "Màn hình Dell UltraSharp U2724D 27 inch 2K IPS Black 120Hz", desc: "Màn hình cao cấp tấm nền IPS Black độ tương phản 2000:1 tần số quét 120Hz", tier: "high", price: 9690000, variant: "27 inch - 2K IPS Black 120Hz" },
        { name: "Màn hình Zowie XL2546X 24.5 inch Fast TN 240Hz DyAc+ 2", desc: "Màn hình thi đấu CS2 Valorant chuyên nghiệp công nghệ DyAc 2 độc quyền", tier: "high", price: 12990000, variant: "24.5 inch - 240Hz DyAc 2" },
        { name: "Màn hình LG UltraGear OLED 27GS95QE-B 27 inch 2K 240Hz", desc: "Màn hình OLED 240Hz tốc độ phản hồi 0.03ms cho dàn PC Hi-End RTX 4080 RTX 4090", tier: "high", price: 18990000, variant: "27 inch - 2K OLED 240Hz" },
        { name: "Màn hình Samsung Odyssey G7 28 inch 4K IPS 144Hz", desc: "Màn hình 4K UHD 144Hz sắc nét tuyệt đối cho game AAA và đồ họa", tier: "high", price: 10990000, variant: "28 inch - 4K UHD - 144Hz" }
    ];

    for (const mn of monitors) {
        items.push({
            name: mn.name,
            description: mn.desc,
            categoryKey: "monitor",
            variantName: mn.variant,
            sku: nextSku("MON"),
            price: mn.price,
            stock: 35,
            mediaFileName: "monitor_demo.png",
            platform: "UNIVERSAL",
            tier: mn.tier
        });
    }

    return items;
}

async function main() {
    console.log("🚀 Bắt đầu seed dữ liệu linh kiện PC, giỏ hàng và đơn hàng...");

    // 1. Đảm bảo có Role và User Admin/Customer
    let adminRole = await prisma.roles.findUnique({ where: { roleName: "administrator" } });
    if (!adminRole) {
        adminRole = await prisma.roles.create({
            data: { roleName: "administrator", description: "can do anythings" }
        });
    }

    let customerRole = await prisma.roles.findUnique({ where: { roleName: "customer" } });
    if (!customerRole) {
        customerRole = await prisma.roles.create({
            data: { roleName: "customer", description: "view, order products" }
        });
    }

    const defaultPasswordHash = await bcrypt.hash(ENV.DEFAULT_ADMIN_PASSWORD || "123456", 10);

    let sellerUser = await prisma.users.findUnique({ where: { account: ENV.DEFAULT_ACCOUNT } });
    if (!sellerUser) {
        sellerUser = await prisma.users.create({
            data: {
                username: ENV.DEFAULT_USERNAME || "Admin Shop",
                account: ENV.DEFAULT_ACCOUNT || "admin",
                password_hash: defaultPasswordHash,
                email: ENV.DEFAULT_EMAIL || "admin@shopmrkin.store",
                roleId: adminRole.id
            }
        });
    }

    // 2. Tạo các danh mục linh kiện PC (Categories)
    const categoryDefinitions: { key: ComponentCategory; name: string; slug: string }[] = [
        { key: "cpu", name: "Vi xử lý - CPU", slug: "vi-xu-ly-cpu" },
        { key: "main", name: "Bo mạch chủ - Mainboard", slug: "bo-mach-chu-mainboard" },
        { key: "ram", name: "Bộ nhớ trong - RAM", slug: "bo-nho-trong-ram" },
        { key: "gpu", name: "Card màn hình - VGA", slug: "card-man-hinh-vga" },
        { key: "psu", name: "Nguồn máy tính - PSU", slug: "nguon-may-tinh-psu" },
        { key: "ssd", name: "Ổ cứng SSD", slug: "o-cung-ssd" },
        { key: "case", name: "Vỏ máy tính - Case", slug: "vo-may-tinh-case" },
        { key: "cooler", name: "Tản nhiệt CPU", slug: "tan-nhiet-cpu" },
        { key: "mouse", name: "Chuột Gaming", slug: "chuot-gaming" },
        { key: "keyboard", name: "Bàn phím cơ", slug: "ban-phim-co" },
        { key: "monitor", name: "Màn hình máy tính", slug: "man-hinh-may-tinh" }
    ];

    const categoryMap = new Map<ComponentCategory, number>();
    for (const cat of categoryDefinitions) {
        const upserted = await prisma.categories.upsert({
            where: { slug: cat.slug },
            update: { name: cat.name },
            create: { name: cat.name, slug: cat.slug }
        });
        categoryMap.set(cat.key, upserted.id);
    }

    // 3. Seed 214 sản phẩm kèm 1 Variant và 1 Media cho mỗi sản phẩm
    const catalog = buildProductCatalog();
    const createdRecords: {
        productId: string;
        variantId: string;
        price: number;
        meta: ProductSeedItem;
    }[] = [];

    for (const item of catalog) {
        const categoryId = categoryMap.get(item.categoryKey)!;
        const createdProduct = await prisma.products.create({
            data: {
                name: item.name,
                description: item.description,
                userId: sellerUser.id,
                categoryId,
                variants: {
                    create: {
                        name: item.variantName,
                        sku: item.sku,
                        stock: item.stock,
                        price: item.price,
                        userId: sellerUser.id
                    }
                },
                media: {
                    create: {
                        fileName: item.mediaFileName,
                        filePath: `${ENV.UPLOAD_FOLDER}/${item.mediaFileName}`,
                        storage: "internal",
                        media_type: "IMAGE",
                        size: 102400,
                        userId: sellerUser.id,
                        status: "ASSIGNED"
                    }
                }
            },
            include: {
                variants: true
            }
        });

        createdRecords.push({
            productId: createdProduct.id,
            variantId: createdProduct.variants[0].id,
            price: item.price,
            meta: item
        });
    }

    console.log(`✅ Đã seed ${createdRecords.length} sản phẩm linh kiện PC (kèm Variant & Media).`);

    // 4. Phân nhóm linh kiện theo sự tương thích (Socket/RAM/Tier) để tạo giỏ hàng & đơn hàng chuẩn
    const pickList = (
        categoryKey: ComponentCategory,
        filterFn?: (item: ProductSeedItem) => boolean
    ) =>
        createdRecords.filter(
            (r) => r.meta.categoryKey === categoryKey && (!filterFn || filterFn(r.meta))
        );

    const buildTemplates = [
        // Nhóm 1: Cấu hình AMD AM4 + DDR4 + GPU phổ thông/tầm trung
        {
            name: "AM4_DDR4_BUDGET_GAMING",
            cpus: pickList("cpu", (i) => i.platform === "AM4_DDR4" && i.tier !== "high"),
            mains: pickList("main", (i) => i.platform === "AM4_DDR4"),
            rams: pickList("ram", (i) => i.platform === "AM4_DDR4" || i.platform === "LGA1700_DDR4"),
            gpus: pickList("gpu", (i) => i.tier !== "high"),
            psus: pickList("psu", (i) => i.tier !== "high"),
            ssds: pickList("ssd", (i) => i.tier !== "high"),
            cases: pickList("case", (i) => i.tier !== "high"),
            coolers: pickList("cooler", (i) => i.tier !== "high"),
            mice: pickList("mouse", (i) => i.tier !== "high"),
            keyboards: pickList("keyboard", (i) => i.tier !== "high"),
            monitors: pickList("monitor", (i) => i.tier !== "high")
        },
        // Nhóm 2: Cấu hình AMD AM5 + DDR5 + GPU cao cấp
        {
            name: "AM5_DDR5_HIGH_END",
            cpus: pickList("cpu", (i) => i.platform === "AM5_DDR5"),
            mains: pickList("main", (i) => i.platform === "AM5_DDR5"),
            rams: pickList("ram", (i) => i.platform === "AM5_DDR5"),
            gpus: pickList("gpu", (i) => i.tier !== "budget"),
            psus: pickList("psu", (i) => i.tier === "high"),
            ssds: pickList("ssd", (i) => i.tier !== "budget"),
            cases: pickList("case", (i) => i.tier !== "budget"),
            coolers: pickList("cooler", (i) => i.tier !== "budget"),
            mice: pickList("mouse", (i) => i.tier !== "budget"),
            keyboards: pickList("keyboard", (i) => i.tier !== "budget"),
            monitors: pickList("monitor", (i) => i.tier !== "budget")
        },
        // Nhóm 3: Cấu hình Intel LGA1700 + DDR4 + GPU tầm trung
        {
            name: "INTEL_LGA1700_DDR4_MID",
            cpus: pickList("cpu", (i) => i.platform === "LGA1700_DDR4"),
            mains: pickList("main", (i) => i.platform === "LGA1700_DDR4"),
            rams: pickList("ram", (i) => i.platform === "LGA1700_DDR4" || i.platform === "AM4_DDR4"),
            gpus: pickList("gpu", (i) => i.tier !== "high"),
            psus: pickList("psu", (i) => i.tier !== "high"),
            ssds: pickList("ssd", (i) => i.tier !== "high"),
            cases: pickList("case", (i) => i.tier !== "high"),
            coolers: pickList("cooler", (i) => i.tier !== "high"),
            mice: pickList("mouse", (i) => i.tier !== "high"),
            keyboards: pickList("keyboard", (i) => i.tier !== "high"),
            monitors: pickList("monitor", (i) => i.tier !== "high")
        },
        // Nhóm 4: Cấu hình Intel LGA1700 + DDR5 + GPU cao cấp
        {
            name: "INTEL_LGA1700_DDR5_HIGH",
            cpus: pickList("cpu", (i) => i.platform === "LGA1700_DDR5"),
            mains: pickList("main", (i) => i.platform === "LGA1700_DDR5"),
            rams: pickList("ram", (i) => i.platform === "LGA1700_DDR5"),
            gpus: pickList("gpu", (i) => i.tier === "high"),
            psus: pickList("psu", (i) => i.tier === "high"),
            ssds: pickList("ssd", (i) => i.tier === "high"),
            cases: pickList("case", (i) => i.tier === "high"),
            coolers: pickList("cooler", (i) => i.tier === "high"),
            mice: pickList("mouse", (i) => i.tier === "high"),
            keyboards: pickList("keyboard", (i) => i.tier === "high"),
            monitors: pickList("monitor", (i) => i.tier === "high")
        }
    ];

    // 5. Tạo 60 khách hàng, mỗi khách hàng có 1 Giỏ hàng (Carts + CartItems) và 2 Đơn hàng (Orders + OrderItems) chứa các combo linh kiện tương thích
    const TOTAL_CUSTOMERS = 60;
    let totalCartItems = 0;
    let totalOrders = 0;

    for (let i = 1; i <= TOTAL_CUSTOMERS; i++) {
        const accountName = `pc_builder_${String(i).padStart(3, "0")}`;
        const email = `${accountName}@shopmrkin.store`;

        const user = await prisma.users.upsert({
            where: { account: accountName },
            update: {},
            create: {
                username: `Khách Build PC #${i}`,
                account: accountName,
                password_hash: defaultPasswordHash,
                email,
                roleId: customerRole.id
            }
        });

        const template = buildTemplates[(i - 1) % buildTemplates.length];
        const idx = i - 1;

        // Chọn combo linh kiện tương thích cho giỏ hàng hiện tại của user
        const cpu = template.cpus[idx % template.cpus.length];
        const main = template.mains[idx % template.mains.length];
        const ram = template.rams[idx % template.rams.length];
        const gpu = template.gpus[idx % template.gpus.length];
        const psu = template.psus[idx % template.psus.length];
        const ssd = template.ssds[idx % template.ssds.length];
        const pcCase = template.cases[idx % template.cases.length];
        const cooler = template.coolers[idx % template.coolers.length];
        const mouse = template.mice[idx % template.mice.length];
        const keyboard = template.keyboards[idx % template.keyboards.length];
        const monitor = template.monitors[idx % template.monitors.length];

        const cartBundle = [
            { item: cpu, quantity: 1 },
            { item: main, quantity: 1 },
            { item: ram, quantity: (i % 2) + 1 },
            { item: gpu, quantity: 1 },
            { item: psu, quantity: 1 },
            { item: ssd, quantity: 1 },
            { item: cooler, quantity: 1 },
            ...(i % 2 === 0
                ? [
                      { item: pcCase, quantity: 1 },
                      { item: monitor, quantity: 1 }
                  ]
                : [
                      { item: mouse, quantity: 1 },
                      { item: keyboard, quantity: 1 }
                  ])
        ];

        // Tạo Cart và CartItems
        const existingCart = await prisma.carts.findUnique({ where: { userId: user.id } });
        const cart = existingCart
            ? existingCart
            : await prisma.carts.create({
                  data: { userId: user.id }
              });

        await prisma.cartItems.deleteMany({ where: { cartId: cart.id } });
        await prisma.cartItems.createMany({
            data: cartBundle.map((b) => ({
                cartId: cart.id,
                variantId: b.item.variantId,
                quantity: b.quantity
            })),
            skipDuplicates: true
        });
        totalCartItems += cartBundle.length;

        // Tạo Order 1: Combo Core PC (CPU + Main + RAM + SSD + PSU + GPU)
        const order1Items = [
            { item: cpu, quantity: 1 },
            { item: main, quantity: 1 },
            { item: ram, quantity: 2 },
            { item: ssd, quantity: 1 },
            { item: psu, quantity: 1 },
            { item: gpu, quantity: 1 }
        ];
        const order1Total = order1Items.reduce((sum, x) => sum + x.item.price * x.quantity, 0);

        await prisma.orders.create({
            data: {
                userId: user.id,
                totalAmount: order1Total,
                status: "DELIVERED",
                orderItems: {
                    create: order1Items.map((x) => ({
                        variantId: x.item.variantId,
                        quantity: x.quantity,
                        unitPrice: x.item.price
                    }))
                }
            }
        });
        totalOrders++;

        // Tạo Order 2: Combo Gaming Gear & Tản nhiệt + Màn hình đi kèm cùng hệ sinh thái
        const altIdx = idx + 1;
        const order2Items = [
            { item: template.cpus[altIdx % template.cpus.length], quantity: 1 },
            { item: template.mains[altIdx % template.mains.length], quantity: 1 },
            { item: template.rams[altIdx % template.rams.length], quantity: 1 },
            { item: cooler, quantity: 1 },
            { item: pcCase, quantity: 1 },
            { item: mouse, quantity: 1 },
            { item: keyboard, quantity: 1 },
            { item: monitor, quantity: 1 }
        ];
        const order2Total = order2Items.reduce((sum, x) => sum + x.item.price * x.quantity, 0);

        await prisma.orders.create({
            data: {
                userId: user.id,
                totalAmount: order2Total,
                status: "DELIVERED",
                orderItems: {
                    create: order2Items.map((x) => ({
                        variantId: x.item.variantId,
                        quantity: x.quantity,
                        unitPrice: x.item.price
                    }))
                }
            }
        });
        totalOrders++;
    }

    console.log(
        `🎉 Hoàn tất! Đã tạo ${catalog.length} sản phẩm, ${TOTAL_CUSTOMERS} giỏ hàng (${totalCartItems} cart items) và ${totalOrders} đơn hàng tương thích.`
    );
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error("❌ Lỗi khi chạy product_seed.ts:", e);
        await prisma.$disconnect();
        process.exit(1);
    });
