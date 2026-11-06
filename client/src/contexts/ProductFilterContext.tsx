import React, { useState, useContext, createContext, useCallback } from "react";

interface ProductFilterContextType {
    category?: string;
    categoryId?: number;
    categoryName?: string;
    changeCategory: (categoryId?: number, categoryName?: string) => void;
}

const ProductFilterContext = createContext<ProductFilterContextType | undefined>(undefined);

export function ProductFilterProvider({ children }: { children: React.ReactNode }) {
    const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
    const [categoryName, setCategoryName] = useState<string | undefined>(undefined);

    const changeCategory = useCallback((id?: number, name?: string) => {
        setCategoryId(id);
        setCategoryName(name);
    }, []);

    const value: ProductFilterContextType = {
        category: categoryName,
        categoryId,
        categoryName,
        changeCategory
    };

    return (
        <ProductFilterContext.Provider value={value}>
            {children}
        </ProductFilterContext.Provider>
    );
}

export function useProductFilter(): ProductFilterContextType {
    const context = useContext(ProductFilterContext);
    if (!context) {
        throw new Error("useProductFilter must be used within ProductFilterProvider");
    }
    return context;
}
