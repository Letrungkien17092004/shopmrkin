// import React, { useCallback, useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import ProductService from "../../../services/ProductService.ts";
// import type { Product } from "../../../services/ProductService.ts";
// import { NormalButton } from "../../../components/buttons/Button.tsx";
// import Loading from "../../../components/Loading.tsx";
// import { ProductTable, ProductTableRow } from "../../../components/table/index.ts";
// import useNotificationController from "../../../hooks/useNotificationController.ts";
// import Notification from "../../../components/notifications/Notification.tsx";

// const productService = new ProductService()
// export default function ProductManager() {
//     const [products, setProducts] = useState<Product[]>([])
//     const [toDelete, setToDelete] = useState<string | null>(null)
//     const [isDeleting, setIsDeleting] = useState<boolean>(false)
//     const { notifications, pushNotification, removeNotification } = useNotificationController()
//     // initial data
//     useEffect(() => {
//         const fetch = async () => {
//             setProducts(await productService.getAll())
//         }

//         fetch()
//     }, [])

//     // delete product 
//     useEffect(() => {
//         if (!toDelete) { return }
//         const deleteData = async () => {
//             try {
//                 await productService.deleteById(toDelete)
//                 setProducts(await productService.getAll())
//                 pushNotification({
//                     message: "Xóa thành công",
//                     type: "bottom-right"
//                 })
//             } catch (error) {
//                 console.log("Có lỗi xảy ra vui lòng thử lại sau")
//                 pushNotification({
//                     message: "Xóa không thành công",
//                     type: "bottom-right"
//                 })

//             } finally {
//                 setToDelete(null)
//                 setIsDeleting(false)
//             }
//         }

//         deleteData()
//         setIsDeleting(true)
//     }, [toDelete])


//     const onDeleteItem = useCallback((id: string) => {
//         return (e: React.MouseEvent) => {
//             e.stopPropagation()
//             setToDelete(id)
//         }
//     }, [])
//     return (<>
//         {notifications.map(notice => (
//             <Notification
//                 key={notice.id}
//                 message={notice.message}
//                 type={notice.type}
//                 onClose={removeNotification(notice.id)}
//             />
//         ))}
//         <div className="pad-24px h-full-vh">
//             <div className="h-5pt">
//                 <span className="text-3xl font-normal">
//                     Danh sách sản phẩm
//                 </span>
//             </div>
//             <div className="h-5pt flex justify-end">
//                 <NormalButton>
//                     <Link className="disable-link" to="new">Thêm mới</Link>
//                 </NormalButton>
//             </div>
//             <div className="dash-dark"></div>
//             {
//                 isDeleting
//                     ? (
//                         <Loading />
//                     )
//                     : (
//                         <div className="h-90pt product-table-wrapper overflow-scroll-y">
//                             <ProductTable>
//                                 {products.map(prod => (
//                                     <ProductTableRow
//                                         key={prod.id}
//                                         id={`${prod.id}`}
//                                         product_code={prod.product_code}
//                                         media={prod.media[0]!}
//                                         name={prod.name}
//                                         minPrice={prod.minPrice}
//                                         maxPrice={prod.maxPrice}
//                                         stock={prod.stock}
//                                         onDelete={onDeleteItem(prod.id)}
//                                     />
//                                 ))}
//                             </ProductTable>
//                         </div>
//                     )
//             }
//         </div>
//     </>)
// }