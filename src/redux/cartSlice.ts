import { createSlice } from "@reduxjs/toolkit";
import mongoose from "mongoose";


interface IGrocery {
  _id?: mongoose.Types.ObjectId;
  name: string;
  category: string;
  price: string;
  unit: string;
  image: string;
  quantity: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ICartSlice {
  cartData: IGrocery[],
  subTotal:number,
  deliveryFee:number,
  finalTotal:number
}

const initialState: ICartSlice = {
  cartData: [],
  subTotal:0,
  deliveryFee:40,
  finalTotal:40
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCartData: (state, action) => {
      state.cartData?.push(action.payload);
      cartSlice.caseReducers.calculateTotals(state);
    },

    increaseQuantity: (state, action) => {
      const item = state.cartData?.find((i) => i._id == action.payload);
      if (item) {
        item.quantity = item.quantity + 1;
      }
       cartSlice.caseReducers.calculateTotals(state);
    },
    decreaseQuantity: (state, action) => {
      const item = state.cartData?.find((i) => i._id == action.payload);
      if (item?.quantity && item?.quantity > 1) {
        item.quantity = item.quantity - 1;
      } else {
        state.cartData = state.cartData?.filter(
          (i) => i._id !== action.payload,
        );
      }
       cartSlice.caseReducers.calculateTotals(state);
    },
    removeFromItem:(state,action) => {
      state.cartData = state.cartData?.filter(
          (i) => i._id !== action.payload,
        );
         cartSlice.caseReducers.calculateTotals(state);
    },

    calculateTotals:(state)=>{
     state.subTotal = state.cartData.reduce((sum,item)=>sum + Number(item.price) * item.quantity,0)
     state.deliveryFee = state.subTotal > 100 ? 0 : 40;
      state.finalTotal = state.subTotal + state.deliveryFee;
    }

  },
});
export const { removeFromItem , addToCartData, increaseQuantity, decreaseQuantity,} =
  cartSlice.actions;
export default cartSlice.reducer;
