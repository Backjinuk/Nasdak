import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { CategoryType } from "TypeList";
import { RootState } from "app/store";
import axios from "axios";

const categoriesAdapter = createEntityAdapter({
    selectId : (category : CategoryType) => category.categoryNo
})

const initialState = categoriesAdapter.getInitialState({
    status : 'idle',
    error : ''
})

export const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers :{
        dropCategories : state => {
            state.status = 'idle'
            categoriesAdapter.removeAll(state)
        }
    },
    extraReducers(builder) {
        builder.addCase(axiosGetCategoryList.pending, (state, action) => {
            state.status = 'loading'
        }).addCase(axiosGetCategoryList.fulfilled, (state, action) => {
            state.status = 'succeeded'
            categoriesAdapter.setAll(state, action.payload)
        }).addCase(axiosGetCategoryList.rejected, (state, action) => {
            state.status = 'failed'
            const message = action.error.message
            if(message !== undefined) state.error = message
        }).addCase(axiosAddCategory.fulfilled, (state, action)=>{
            categoriesAdapter.addOne(state, action.payload)
        }).addCase(axiosUpdateCategory.fulfilled, (state, action) =>{
            categoriesAdapter.upsertOne(state, action.payload)
        }).addCase(axiosDeleteCategory.fulfilled, (state, action) =>{
            categoriesAdapter.removeOne(state, action.payload.categoryNo)
        }).addCase(axiosIntegrateCategory.fulfilled, (state, action) =>{
            categoriesAdapter.removeMany(state, action.payload)
        })
    },
})

export const axiosGetCategoryList = createAsyncThunk('categories/axiosGetCategoryList', async (userNo:number) => {
    const res = await axios.post("/api/category/getCategoryList", JSON.stringify({userNo}),{
        headers: {"Content-Type": "application/json"}
    })
    return res.data
})

export const axiosAddCategory = createAsyncThunk('categories/axiosAddCategory', async (category : CategoryType) => {
    const res = await axios.post("/api/category/addCategory", JSON.stringify(category),{
            headers : {"Content-Type" : "application/json"}
        })
    return res.data
})

export const axiosUpdateCategory = createAsyncThunk('categories/axiosUpdateCategory',async (category : CategoryType) => {
    await axios.post("/api/category/updateCategory", JSON.stringify(category),{
                headers : {"Content-Type" : "application/json"}
            })
    return category
})

export const axiosDeleteCategory = createAsyncThunk('categories/axiosDeleteCategory',async (category : CategoryType) => {
    await axios.post("/api/category/deleteCategory", JSON.stringify(category),{
                headers : {"Content-Type" : "application/json"}
            })
    return category
})

export const axiosIntegrateCategory = createAsyncThunk('categories/axiosIntegrateCategory',async (data : {before : number[], after : number}) => {
    await axios.post("/api/category/integrateCategory", JSON.stringify(data),{
                headers : {"Content-Type" : "application/json"}
            })
    return data.before
})

export const { dropCategories } = categoriesSlice.actions

export default categoriesSlice.reducer

export const { selectAll : selectAllCategories, selectById : selectCategoryById, selectIds : selectCategoryIds } = categoriesAdapter.getSelectors((state:RootState) => state.categories)