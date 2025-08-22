import React from "react"


export default function Dashboard() {
    return (<>
        <main className="height-100vh padding-8px">
            <div className="grid">
                <div className="row no-gutters">
                    <div className="col l-2">
                        <div className="width-full padding-8px bg-primary border-radius-8px">
                            <span className="display-block text-align-center font-size-2rem">Shopmrkin</span>
                            <div className="dash-light margin-top-bot-12px"></div>
                            <div className="widht-full">
                                <span>Đơn đặt hàng</span>
                            </div>
                            <div className="widht-full">
                                <span>Danh sách mặt hàng</span>
                            </div>
                            <div className="widht-full">
                                <span>Quản lý người dùng</span>
                            </div>
                            <div className="widht-full">
                                <span>Quản lý mã giảm giá</span>
                            </div>
                        </div>
                    </div>
                    <div className="col l-10">
                        <div className="">b</div>
                    </div>
                </div>
            </div>
        </main>
    </>)
}