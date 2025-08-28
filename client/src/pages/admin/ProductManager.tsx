import React, { useState } from "react";


export default function ProductManager() {
    return (<>
        <div className="pad-24px h-full-vh">
            <div className="h-10pt">
                <span className="text-3xl font-normal">
                    Danh sách sản phẩm
                </span>
            </div>
            <div className="dash-dark"></div>
            <div className="h-90pt product-table-wrapper overflow-scroll-y">
                <table className="product-table text-sm font-normal">
                    <thead>
                        <tr>
                            <th>#ID</th>
                            <th>Ảnh</th>
                            <th>Tên SP</th>
                            <th>Khoảng giá</th>
                            <th>Mô tả</th>
                            <th>Stock</th>
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
                        <tr>
                            <td>2</td>
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
                        <tr>
                            <td>2</td>
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
                        <tr>
                            <td>2</td>
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
                        <tr>
                            <td>2</td>
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
                        <tr>
                            <td>2</td>
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