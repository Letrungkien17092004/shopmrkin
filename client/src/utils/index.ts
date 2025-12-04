import { getCartItemByVariantId } from "./cart.utils.ts"
import {
    getTotalStock,
    getMinPrice,
    getMaxPrice,
    makeThumbnailURL

} from "./product.utils.ts"

function formatPrice(value: number) {
    if (typeof value === 'number') return value.toLocaleString('vi-VN') + ' đ';
    return value;
}

export {
    getCartItemByVariantId,
    formatPrice,
    getTotalStock,
    getMinPrice,
    getMaxPrice,
    makeThumbnailURL
}