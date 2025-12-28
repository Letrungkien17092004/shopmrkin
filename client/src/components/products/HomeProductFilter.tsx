import React from "react"

export default function HomeProductFilter() {
    return (<>
        <section className="w-full p-4 shadow md:shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
            <div className="text-lg font-bold text-center border-b border-gray-300">
                <span>Lựa chọn lọc</span>
            </div>

            <div className="w-full flex md:block">
                <div className="w-full">
                    <div className="text-base font-bold"><span>Lọc theo danh mục</span></div>
                    <ul className="w-full pl-2">
                        <li className="text-base hover:text-green-500 cursor-pointer">
                            Điện thoại
                        </li>
                        <li className="text-base hover:text-green-500 cursor-pointer">
                            Máy tính
                        </li>
                        <li className="text-base hover:text-green-500 cursor-pointer">
                            Laptop
                        </li>
                        <li className="text-base hover:text-green-500 cursor-pointer">
                            PC
                        </li>
                        <li className="text-base hover:text-green-500 cursor-pointer">
                            Thời trang nam
                        </li>
                        <li className="text-base hover:text-green-500 cursor-pointer">
                            Thời trang nữ
                        </li>
                    </ul>
                </div>

                <div className="w-full">
                    <div className="text-base font-bold">Lọc theo tình trạng</div>
                    <ul className="w-full pl-2">
                        <li className="text-base hover:text-green-500 cursor-pointer">
                            Đồ cũ
                        </li>
                        <li className="text-base hover:text-green-500 cursor-pointer">
                            Like new
                        </li>
                        <li className="text-base hover:text-green-500 cursor-pointer">
                            Mới
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    </>)
}