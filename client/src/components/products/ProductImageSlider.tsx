import React, { useCallback, useState } from "react";
interface Image {
    url: string
}

interface ProductImageSliderProps {
    images: Image[]
}

export default function ProductImageSlider({ images }: ProductImageSliderProps) {
    const totalImage = images.length
    if (totalImage === 0) { return <h1>ProductImageSlider is used but no image is provided </h1> }
    const [currentIdx, setCurrentIdx] = useState<number>(0)

    const goToNext = useCallback((event: React.MouseEvent) => {
        event.stopPropagation()
        const totalImage = images.length
        setCurrentIdx(currentIdx === totalImage - 1 ? 0 : currentIdx + 1)
    }, [images, currentIdx])

    const goToPrevious = useCallback((event: React.MouseEvent) => {
        event.stopPropagation()
        const totalImage = images.length
        setCurrentIdx(currentIdx === 0 ? totalImage - 1 : currentIdx - 1)
    }, [images, currentIdx])

    const setByItem = useCallback((index: number) => {
        return (event: React.MouseEvent) => {
            event.stopPropagation()
            setCurrentIdx(index)
        }
    }, [])

    return (<>
        {/* link css */}
        <section className="w-full">
            {/* slider */}
            <div className="w-full">
                <div className="grid">
                    <div className="row">
                        <div className="col l-1">
                            <div className="w-full h-full flex flex-center">
                                <span onClick={goToPrevious} className="productImageSlider-button">&lt;</span>
                            </div>
                        </div>
                        <div className="col l-10">
                            <img className="productImageSlider-currentImage" src={images[currentIdx].url} alt="" />
                        </div>
                        <div className="col l-1">
                            <div className="w-full h-full flex flex-center">
                                <span onClick={goToNext} className="productImageSlider-button">&gt;</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* image items */}
            <div className="w-full">
                <div className="grid">
                    <div className="row justify-center">
                        {images.map((img, idx) => {
                            if (idx === currentIdx) {
                                return (
                                    <div key={`${img.url}`} onClick={setByItem(idx)} className="col c-2 m-2 l-2">
                                        <img className="productImageSlider-imageItem productImageSlider-imageItem--selected" src={img.url} alt="" />
                                    </div>
                                )
                            }
                            return (
                                <div key={`${img.url}`} onClick={setByItem(idx)} className="col c-2 m-2 l-2" >
                                    <img className="productImageSlider-imageItem" src={img.url} alt="" />
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section >
    </>
    )
}