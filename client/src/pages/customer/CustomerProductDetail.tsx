import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Navivation } from "../../components/nav/index.tsx";
import { ProductImageSlider } from "../../components/products/index.tsx"
import Loading from "../../components/Loading.tsx";
import ProductService from "../../services/ProductService.ts";
import { Product, Variant } from "../../types/index.ts";
import { addCartItem } from "../../store/cartSlice.ts"
import { RootState, AppDispatch } from "../../store/index.ts";
import { useDispatch, useSelector } from "react-redux";
import { useAuthContext } from "../../contexts/AuthContext.tsx";
import { getCartItemByVariantId } from "../../utils/index.ts"

const productService = new ProductService()

interface VariantListProps {
    variants: Variant[],
    selectedVariant: Variant | undefined,
    createSelectedEvent: (id: string) => ((e: React.MouseEvent) => void) | undefined
}

function VariantList({ variants, selectedVariant, createSelectedEvent }: VariantListProps) {
    return <>
        {variants.map(v => {
            return <>
                {
                    selectedVariant && selectedVariant.id === v.id
                        ? <>
                            <div onClick={createSelectedEvent(v.id)} key={v.sku} className="cursor-pointer select-none bg-green-400 rounded shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
                                <div className="w-full p-1 px-2 text-sm text-white text-center text-nowrap">
                                    {v.name}
                                </div>
                            </div>
                        </>
                        : <>
                            <div onClick={createSelectedEvent(v.id)} key={`${v.sku}_2`} className="cursor-pointer select-none hover:ring hover:ring-green-500 rounded shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
                                <div className="w-full p-1 px-2 text-sm text-black text-center  text-nowrap">
                                    {v.name}
                                </div>
                            </div>
                        </>
                }
            </>
        })}
    </>
}

export default function CustomerProductDetail() {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [product, setProduct] = useState<Product | undefined>(undefined)
    const [defaultPrice, setDefaultPrice] = useState<string | undefined>(undefined)
    const [selectedVariant, setSelectedVariant] = useState<Variant | undefined>(undefined)
    const { productId } = useParams()
    const [isAdding, setIsAdding] = useState<boolean>(false)
    const [canAdd, setCanAdd] = useState<boolean>(false)
    const dispatch: AppDispatch = useDispatch()
    const { cart } = useSelector((state: RootState) => state.cart)
    const { profile } = useAuthContext()

    useEffect(() => {
        const fetchData = async () => {
            const productData = await productService.findById(productId!)
            if (productData) {
                setProduct(productData)
                setDefaultPrice(`${productData.minPrice} - ${productData.maxPrice}`)
            }
            setIsLoading(false)
        }
        fetchData()
    }, [])

    useEffect(() => {
        if (isAdding) {
            setCanAdd(false)
            return
        }

        // if selectedVariant isn't null
        if (selectedVariant) {
            setCanAdd(true)
        } else if (!selectedVariant) {
            setCanAdd(false)
        }
    }, [selectedVariant, isAdding])

    const createSelectedEvent = useCallback((id: string) => {
        if (!product) { return }
        if (product.variants.length <= 0) { return }
        return (e: React.MouseEvent) => {
            e.stopPropagation()
            if (selectedVariant && selectedVariant.id === id) {
                setSelectedVariant(undefined)
                return
            }
            setSelectedVariant(product.variants.find(v => v.id === id))
        }
    }, [product, selectedVariant])

    // event hander for adding item to the shopping cart
    const addItemEvent = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()
        if (!profile) {
            window.alert("Bạn cần đăng nhập!")
            return
        }
        if (!cart) {
            window.alert("Vui lòng thử lại sau!")
            return
        }

        if (!selectedVariant || isAdding) { return }

        const callApi = async () => {
            let quantity = 1
            let item = getCartItemByVariantId(cart, selectedVariant.id)
            if (item) {
                quantity = item.quantity + 1
            }
            await dispatch(addCartItem({
                cartId: cart.id,
                variantId: selectedVariant.id,
                quantity: quantity
            }))
        }
        setIsAdding(true)

        callApi()
            .then(() => {
                setIsAdding(false)
                window.alert("Thêm sản phẩm thành công")
            })
            .catch((err) => {
                setIsAdding(false)
                window.alert("Thêm vào giỏ hàng thất bại")
                console.log("[Error] in CustomerProductDetail->AddItemEvent: \n", err)
            })

    }, [selectedVariant, isAdding, cart])

    if (isLoading) {
        return <>
            <Navivation />
            <div className="w-full h-100 flex justify-center items-center">
                <Loading />
            </div>
        </>
    }

    if (isLoading === false && product === undefined) {
        return <>
            <Navivation />
            <div className="w-full h-100 flex justify-center items-center">
                <h1 className="text-xl">Không tìm thấy sản phẩm bạn yêu cầu</h1>
            </div>
        </>
    }
    if (product) {
        return (

            <div className="max-w-[1000px] mx-auto">
                <Navivation />
                {/* slider and variant options */}
                <div className="w-full mt-3 sm:flex sm:justify-end">
                    {/* Slider */}
                    <div className="w-[70%] mx-auto sm:w-1/3 sm:mr-24">
                        <ProductImageSlider
                            images={product.media.map(med => ({ url: `${med.hostname}${med.filePath}` }))}
                        />
                    </div>
                    {/* info (name, price, variant, ...) */}
                    <div className="w-[70%] mx-auto sm:w-1/3">
                        <div className="w-full">
                            <p title={product.name} className="text-lg text-black line-clamp-4">
                                {product.name}
                            </p>

                            <p className="text-2xl font-semibold text-orange-500">
                                {selectedVariant ? `${selectedVariant.price}` : defaultPrice}
                            </p>

                            {/* variant options */}
                            <div className="w-full mt-3 flex justify-start items-center flex-wrap gap-2">
                                <p className="text-base font-bold flex items-center">
                                    Tùy chọn:
                                </p>
                                <VariantList
                                    variants={product.variants}
                                    selectedVariant={selectedVariant}
                                    createSelectedEvent={createSelectedEvent}
                                />
                            </div>

                            {/* actions */}
                            <div className="w-full mt-4">
                                {
                                    canAdd
                                        ? <button onClick={addItemEvent} className="inline-block rounded p-2 text-base font-normal bg-orange-500 text-white cursor-pointer hover:scale-105 transition">
                                            Thêm vào giỏ hàng
                                        </button>
                                        : <button title="vui lòng chọn mặt hàng" className="inline-block rounded p-2 text-base font-normal bg-gray-400 text-white">
                                            Thêm vào giỏ hàng
                                        </button>
                                }

                            </div>
                        </div>
                    </div>
                    <div className="dash-dark"></div>
                </div>
                {/* description */}
                <div className="w-full">
                    <p className="text-base font-light">{product.description}</p>
                </div>
            </div>
        )
    }
}