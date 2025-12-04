import { Variant } from "../types/product/index.ts"
import { Media } from "../types/media/index.ts"

/**
 * get total number of stocks in list of variants
 */
export function getTotalStock(variants: Variant[]): number {
    let totalStock = 0
    variants.forEach(variant => totalStock += variant.stock)
    return totalStock
}

/**
 * get minium number of stocks in list of variants
 */
export function getMinPrice(variants: Variant[]): number {
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
export function getMaxPrice(variants: Variant[]): number {
    let max_ = variants[0]!.price

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
export function makeThumbnailURL(media: Media[]): string {
    const thumbnail = media[0]
    return `${thumbnail.hostname}${thumbnail.filePath}`
}