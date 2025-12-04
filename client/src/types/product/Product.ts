import { Variant } from "./index.ts"
import { Media } from "../media/index.ts"

export default interface Product {
    id: string
    name: string
    product_code: number
    description: string
    category: string
    media: Media[]
    variants: Variant[]
    createdAt: Date
    updatedAt: Date
}



/**
 * Stock getter
 */
//     public get stock(): number {
//     let totalStock = 0
//     this.variants.forEach(variant => totalStock += variant.stock)
//     return totalStock
// }

//     /**
//      * minPrice getter
//      */
//     public get minPrice(): number | null {
//     if (this.variants && this.variants.length !== 0) {
//         let min_ = this.variants[0]!.price
//         this.variants.forEach((variant) => {
//             if (variant.price < min_) {
//                 min_ = variant.price
//             }
//         })
//         return min_

//     }
//     return null
// }

//     /**
//      * maxPrice getter
//      */
//     public get maxPrice(): number | null {
//     if (this.variants && this.variants.length !== 0) {
//         let max_ = this.variants[0]!.price

//         this.variants.forEach((variant) => {
//             if (variant.price > max_) {
//                 max_ = variant.price
//             }
//         })

//         return max_

//     }
//     return null
// }

//     public get thumbnailURL(): string {
//     if (this.media && this.media.length !== 0) {
//         const media = this.media[0]!
//         return `${media.hostname}${media.filePath}`
//     }
//     return "NOIMAGE"
// }
