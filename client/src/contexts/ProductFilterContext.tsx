import React, { useState, useContext, createContext, useCallback } from "react";

interface ProductFilterContextType {
    category?: string,
    changeCategory: (category: string) => void
}

const ProductFilterContext = createContext<ProductFilterContextType | undefined>(undefined)

export function ProductFilterProvider({ children }: { children: React.ReactNode }) {
    const [category, setCategory] = useState<string | undefined>(undefined)

    const changeCategory = useCallback((category: string) => {
        setCategory(category)
    }, [])

    // export values
    const value = {
        category,
        changeCategory
    }
    return (
        <ProductFilterContext.Provider value={value}>
            {children}
        </ProductFilterContext.Provider>
    )
}

export function useProductFilter(): ProductFilterContextType {
    const context = useContext(ProductFilterContext)
    if (!context) {
        throw new Error("useProductFilter must be used within ProductFilterProvider")
    }
    return context
}