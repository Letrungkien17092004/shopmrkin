'use client'

import React from "react"

export default function OrdersPage() {
    return (
        <div className="p-6 h-full">
            <div className="mb-4">
                <span className="text-3xl font-normal">Danh sách đơn hàng chờ</span>
            </div>
            <div className="border-b mb-4"></div>
            <div className="overflow-y-scroll">
                <table className="w-full text-sm font-normal">
                    <thead>
                        <tr>
                            <th>#ID</th>
                            <th>Tên Khách hàng</th>
                            <th>Tài khoản</th>
                            <th>SĐT</th>
                            <th>Danh sách sản phẩm</th>
                            <th>Tổng giá</th>
                            <th>Giá phải trả</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>
                                <img src="/image/van_hi.jpg" alt="Tên SP" className="w-16 h-16 object-cover" />
                            </td>
                            <td>Lorem ipsum dolor sit amet consectetur adipisicing elit.</td>
                            <td>100.000</td>
                            <td>
                                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                            </td>
                            <td>100</td>
                            <td>
                                <button className="btn btn-blue">Chi tiết</button>
                                <button className="btn btn-danger">Xóa</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}
