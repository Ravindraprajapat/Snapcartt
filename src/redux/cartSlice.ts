import { createSlice } from "@reduxjs/toolkit";
import mongoose from "mongoose";

interface IGrocery {
  _id?: mongoose.Types.ObjectId;
  name: string;
  category: string;
  price: string;
  unit: string;
  image: string;
  quantity:number;
  createdAt?: Date;
  updatedAt?: Date;
}


interface ICartSlice{
  cartData:IGrocery[] 
}

const initialState:ICartSlice ={
    cartData:[]
}

const cartSlice = createSlice({
    name:"cart",
    initialState,
    reducers:{
        addToCartData:(state,action)=>{
            state.cartData?.push(action.payload)
        },

        increaseQuantity:(state,action)=>{
           const item = state.cartData?.find(i=>i._id==action.payload)
           if(item){
            item.quantity = item.quantity +1;
           }
        },
        decreaseQuantity:(state,action)=>{
           const item = state.cartData?.find(i=>i._id==action.payload)
           if(item?.quantity && item?.quantity>1){
            item.quantity = item.quantity-1;
           }
           else{
            state.cartData = state.cartData?.filter(i=>i._id!==action.payload) 
           }
        },
    }
})
export const {addToCartData , increaseQuantity , decreaseQuantity} = cartSlice.actions
export default cartSlice.reducer