import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CreateProductFormState {
    name: string,
    description: string,
    categoryId: number,
    fileMedia: {
        id: string,
        file: File
    }[],
    variants: {
        name: string,
        sku: string,
        price: number,
        stock: number
    }[]
}

const initialState: CreateProductFormState = {
    name: "",
    description: "",
    categoryId: 1,
    fileMedia: [],
    variants: []
}

const createProductSlice = createSlice({
    name: "create product",
    initialState,
    reducers: {
        changeName(state, action: PayloadAction<string>) {
            state.name = action.payload
        },
        changeDescription(state, action: PayloadAction<string>) {
            state.description = action.payload
        },
        categoryId(state, action: PayloadAction<number>) {
            state.categoryId = action.payload
        },
        addMedia(state, action: PayloadAction<{ id: string, file: File }>) {
            state.fileMedia.push(action.payload)
        },
        removeMedia(state, action: PayloadAction<{ id: string }>) {
            state.fileMedia = state.fileMedia.filter(fm => fm.id !== action.payload.id)
        }
    }
})