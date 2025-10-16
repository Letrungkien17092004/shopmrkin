import React, { createContext, useState, useCallback, useContext, useReducer } from "react";

interface ProductFormData {
    name: string,
    description: string,
}

interface VariantFormData {
    name: string,
    sku: string,
    price: number,
    stock: number
}

interface MediaFormData {
    id: string,
    file: File,
}
interface CreateProductContextType {
    product: ProductFormData,
    variants: VariantFormData[],
    media: MediaFormData[]

    // Callback setters
    updateProduct: (data: Partial<ProductFormData>) => void;
    addVariant: (newVariant: VariantFormData) => void;
    deleteVariant: (sku: string) => void;
    addMedia: (newMedia: MediaFormData) => void;
    deleteMedia: (id: string) => void;
}

interface CreateProductFormContextProps {
    children: React.ReactNode
}

type VariantsReducerAction = {
    type: "add",
    newVariant: VariantFormData
} | {
    type: "delete",
    sku: string
}

type MediaReducerAction = {
    type: "add",
    newMedia: MediaFormData
} | {
    type: "delete",
    id: string
}

function variantsReducer(state: VariantFormData[], action: VariantsReducerAction): VariantFormData[] {
    switch (action.type) {
        case "add":
            return [...state, action.newVariant]
        case "delete":
            const afterFilter = state.filter(item => item.sku !== action.sku)
            return afterFilter
        default:
            throw new Error("Error in CreateProductContext - variantReducer: unknow action type")
    }
}

function mediaReducer(state: MediaFormData[], action: MediaReducerAction): MediaFormData[] {
    switch (action.type) {
        case "add":
            return [...state, action.newMedia]
        case "delete":
            const afterFilter = state.filter(item => item.id !== action.id)
            return afterFilter
        default:
            throw new Error("Error in CreateProductContext - mediaReducer: unknow action type")
    }
}
// Create context
const CreateProductFormContext = createContext<CreateProductContextType | undefined>(undefined)

export const CreateProductProvider = ({
    children,
}: CreateProductFormContextProps) => {
    const [product, setProduct] = useState<ProductFormData>({ name: "", description: "" })
    const [variants, variantsDispatcher] = useReducer(variantsReducer, [])
    const [media, mediaDispatcher] = useReducer(mediaReducer, [])

    // Update productFormData callbacks
    const updateProduct = useCallback((data: Partial<ProductFormData>) => {
        setProduct((prev) => ({ ...prev, ...data }));
    }, []);


    // Add Variant callback
    const addVariant = useCallback((newVariant: VariantFormData) => {
        variantsDispatcher({
            type: "add",
            newVariant: newVariant
        });
    }, []);

    // Delete Variant callback
    const deleteVariant = useCallback((sku: string) => {
        variantsDispatcher({
            type: "delete",
            sku: sku
        });
    }, []);

    // Add Media
    const addMedia = useCallback((newMedia: MediaFormData) => {
        mediaDispatcher({
            type: "add",
            newMedia: newMedia
        })
    }, []);

    const deleteMedia = useCallback((id: string) => {
        mediaDispatcher({
            type: "delete",
            id: id
        })
    }, [])

    const value: CreateProductContextType = {
        product,
        variants,
        media,
        updateProduct,
        addVariant,
        deleteVariant,
        addMedia,
        deleteMedia,
    };

    return (
        <CreateProductFormContext.Provider value={value}>
            {children}
        </CreateProductFormContext.Provider>
    );
};

export const useCreateProduct = (): CreateProductContextType => {
    const context = useContext(CreateProductFormContext);
    if (!context) {
        throw new Error(
            "useCreateProduct must be used within a CreateProductProvider"
        );
    }
    return context;
};
