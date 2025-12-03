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
        <section className="w-full">
            {/* slider */}
            <div className="w-full grid grid-cols-12">
                <div className="col-span-1">
                    <div className="w-full h-full mr-2 flex justify-center items-center select-none">
                        <span onClick={goToPrevious} className="p-2 rounded-full hover:-translate-x-1 hover:bg-gray-200 transition cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                                <path fillRule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
                            </svg>
                        </span>
                    </div>
                </div>
                <div className="col-span-10">
                    <img className="w-[250px] h-[300px] mx-auto object-contain" src={images[currentIdx].url} alt={images[currentIdx].url} />
                </div>
                <div className="col-span-1">
                    <div className="w-full h-full ml-2 flex justify-center items-center select-none">
                        <span onClick={goToNext} className="p-2 rounded-full  hover:translate-x-1 hover:bg-gray-200 transition cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                                <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                            </svg>
                        </span>
                    </div>
                </div>

            </div>

            {/* image items */}
            <div className="w-full mt-4 flex gap-x-2">
                {images.map((img, idx) => {
                    if (idx === currentIdx) {
                        return (
                            <div key={`${img.url}`} onClick={setByItem(idx)} className="w-1/3 overflow-hidden rounded cursor-pointer ring-2 ring-green-500 transition">
                                <img className="object-cover shadow-[0_4px_12px_rgba(0,0,0,0.5)]" src={img.url} alt="" />
                            </div>
                        )
                    }
                    return (
                        <div key={`${img.url}`} onClick={setByItem(idx)} className="w-1/3 overflow-hidden rounded cursor-pointer  transition">
                            <img className="object-cover shadow-[0_4px_12px_rgba(0,0,0,0.5)]" src={img.url} alt="" />
                        </div>
                    )
                })}
            </div>
        </section >
    </>
    )
}