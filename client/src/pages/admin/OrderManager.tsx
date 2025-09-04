import React from "react";

export default function OrderManager() {
    return (<>
        <div className="pad-24px h-full-vh">
            <div className="h-10pt">
                <span className="text-3xl font-normal">
                    Danh sách đơn hàng chờ
                </span>
            </div>
            <div className="dash-dark"></div>
            <div className="h-90pt product-table-wrapper overflow-scroll-y">
                <table className="product-table text-sm font-normal">
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
                            <td className="product-image">
                                <img src="/public/image/van_hi.jpg" alt="Tên SP" />
                            </td>
                            <td>Lorem ipsum dolor sit amet consectetur adipisicing elit. lo</td>
                            <td className="price">100.000</td>
                            <td>
                                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsam, omnis? Quam, doloribus eveniet quae veritatis provident delectus a explicabo cum eum libero voluptatum reiciendis. Ab dolore maxime illum suscipit nihil.
                            </td>
                            <td className="stock">100</td>
                            <td className="actions">
                                <button className="btn btn-blue">Chi tiết</button>
                                <button className="btn btn-danger">Xóa</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </>)
}