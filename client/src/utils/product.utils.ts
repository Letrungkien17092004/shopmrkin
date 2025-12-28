import { Variant } from "../types/product/index.ts"
import { Media } from "../types/media/index.ts"

/**
 * get total number of stocks in list of variants
 */
export function getTotalStock(variants?: Variant[]): number | null {
    if (!variants || variants.length <= 0) {
        return null
    }
    let totalStock = 0
    variants.forEach(variant => totalStock += variant.stock)
    return totalStock
}

/**
 * get minium number of stocks in list of variants
 */
export function getMinPrice(variants?: Variant[]): number | null {
    if (!variants || variants.length <= 0) {
        return null
    }
    let min_ = variants[0].price
    variants.forEach((variant) => {
        if (variant.price < min_) {
            min_ = variant.price
        }
    })
    return min_

}

/**
 * get maxium number of stocks in list of variants
 */
export function getMaxPrice(variants?: Variant[]): number | null {
    if (!variants || variants.length <= 0) {
        return null
    }
    let max_ = variants[0].price

    variants.forEach((variant) => {
        if (variant.price > max_) {
            max_ = variant.price
        }
    })

    return max_

}

/**
 * get the first item in list of media as a thumbnail
 * @param media 
 * @returns 
 */
export function makeThumbnailURL(media?: Media[]): string {
    if (!media || media.length <= 0) {
        return "https://i.pinimg.com/1200x/fd/3d/8e/fd3d8e2a1dd4f09b4170d31e26913bab.jpg"
    }
    const thumbnail = media[0]
    return `${thumbnail.filePath}`
}