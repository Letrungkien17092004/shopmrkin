import { getCartItemByVariantId } from "./cart.utils.ts"


function formatPrice(value: number) {
    if (typeof value === 'number') return value.toLocaleString('vi-VN') + ' đ';
    return value;
}

export {
    getCartItemByVariantId,
    formatPrice
}