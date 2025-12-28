import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MainNav } from "../../components/nav/index.tsx";
import { ProductImageSlider } from "../../components/products/index.ts"
import Loading from "../../components/waiter/Loading.tsx";
import { ProductService, AuthService } from "../../services/index.ts";
import { Product, Variant } from "../../types/product/index.ts";
import { addCartItem } from "../../store/cartSlice.ts"
import { RootState, AppDispatch } from "../../store/index.ts";
import { useDispatch, useSelector } from "react-redux";
import { useAuthContext } from "../../contexts/AuthContext.tsx";
import { getCartItemByVariantId, getMinPrice } from "../../utils/index.ts"
import { ChatContainer } from "../../components/chat/index.tsx";
import { MainLayout } from "../../components/layout/index.tsx"
import { formatPrice } from "../../utils/index.ts";

const authService = new AuthService()
const productService = new ProductService(authService)

interface VariantListProps {
    variants: Variant[],
    selectedVariant: Variant | undefined,
    createSelectedEvent: (id: string) => ((e: React.MouseEvent) => void) | undefined
}

function VariantList({ variants, selectedVariant, createSelectedEvent }: VariantListProps) {
    return (
        <>
            {variants.map(v => {
                const selected = selectedVariant?.id === v.id;

                return (
                    <div
                        key={v.sku}
                        onClick={createSelectedEvent(v.id)}
                        className={
                            "cursor-pointer select-none rounded shadow-[0_4px_12px_rgba(0,0,0,0.3)] " +
                            (selected
                                ? "bg-green-500"
                                : "hover:ring hover:ring-green-500")
                        }
                    >
                        <div className={`w-full p-1 px-2 text-sm text-center text-nowrap ${selected ? "text-white" : "text-black"}`}>
                            {v.name}
                        </div>
                    </div>
                );
            })}
        </>
    );
}


export default function ShowProductDetail() {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [product, setProduct] = useState<Product | undefined>(undefined)
    const [defaultPrice, setDefaultPrice] = useState<{minPrice: number, maxPrice: number} | undefined>(undefined)
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
                setDefaultPrice({
                    minPrice: getMinPrice(productData.variants) || 0,
                    maxPrice: getMinPrice(productData.variants) || 0
                })
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
            <MainNav />
            <div className="w-full h-100 flex justify-center items-center">
                <Loading />
            </div>
        </>
    }

    if (isLoading === false && product === undefined) {
        return <>
            <MainNav />
            <div className="w-full h-100 flex justify-center items-center">
                <h1 className="text-xl">Không tìm thấy sản phẩm bạn yêu cầu</h1>
            </div>
        </>
    }
    if (product) {
        return (<>
            <MainLayout>
                <div className="max-w-5xl mx-auto">
                    {/* slider and variant options */}
                    <div className="w-full mt-3 sm:flex sm:justify-end">
                        {/* Slider */}
                        <div className="w-[70%] mx-auto sm:w-1/3 sm:mr-24">
                            <ProductImageSlider
                                images={product.media.map(med => ({ url: `${med.filePath}` }))}
                            />
                        </div>
                        {/* info (name, price, variant, ...) */}
                        <div className="w-[70%] mx-auto sm:w-1/3">
                            <div className="w-full">
                                <p title={product.name} className="text-xl line-clamp-4">
                                    {product.name}
                                </p>

                                <p className="text-2xl font-semibold text-green-500">
                                    {selectedVariant && formatPrice(selectedVariant.price)}
                                    {!selectedVariant && defaultPrice &&(
                                        `${formatPrice(defaultPrice.minPrice)} - ${formatPrice(defaultPrice.maxPrice)}`
                                    )}
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
                                            ? <button onClick={addItemEvent} className="inline-block rounded p-2 text-base font-normal bg-green-500 text-white cursor-pointer hover:scale-105 transition">
                                                Thêm vào giỏ hàng
                                            </button>
                                            : <button title="vui lòng chọn mặt hàng" className="inline-block rounded p-2 text-base font-normal bg-green-300 text-white">
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

                {/* <ChatContainer /> */}
            </MainLayout>
        </>)
    }
}