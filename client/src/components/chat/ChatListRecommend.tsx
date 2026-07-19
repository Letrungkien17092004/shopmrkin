import React from "react";
import { useRouter } from "next/navigation";
import { AssistantMessage } from '../../types/chat/index.ts';
import { ChatListCard } from "./index.tsx"
interface Props {
    message: AssistantMessage
}

// {message.recommend_products.map((product) => (
//                     <div
//                         key={product.productId}
//                         onClick={() => navigate(`/product-detail/${product.productId}`)}
//                         className="shrink-0 w-32 bg-white rounded-lg border border-gray-300 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow hover:border-blue-400"
//                     >
//                         {/* Product Image */}
//                         <div className="w-full h-28 bg-gray-100 flex items-center justify-center overflow-hidden">
//                             <div className="text-gray-400 text-center">
//                                 {/* Placeholder for product image */}
//                                 <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                                 </svg>
//                                 <p className="text-xs mt-1">Ảnh sản phẩm</p>
//                             </div>
//                         </div>

//                         {/* Product Info */}
//                         <div className="p-2">
//                             {/* Product ID */}
//                             <p className="text-xs text-gray-500 truncate mb-1">{product.productId}</p>

//                             {/* Price */}
//                             <div className="bg-blue-50 rounded px-2 py-1.5">
//                                 <p className="text-xs text-gray-600 mb-0.5">Giá:</p>
//                                 <p className="text-sm font-bold text-blue-600">
//                                     {/* Placeholder for price */}
//                                     --
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                 ))}

export default function ChatListRecommends({ message }: Props) {
    const router = useRouter();

    return (
        <div className="mt-3 w-full">
            <div className="flex gap-2 overflow-x-auto pb-2">
                {/* <ChatListCard productId="019b2c90-8f5a-7053-bd60-17398e17fffa" /> */}
                {message.recommend_products.map(product => (
                    <ChatListCard productId={product.productId} />
                ))}
            </div>
        </div>
    );
}