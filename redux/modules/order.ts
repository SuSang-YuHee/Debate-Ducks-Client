import { RootState } from "../store";
import { createSlice } from "@reduxjs/toolkit";

export interface IOrder {
  value: string;
}

const initialState: IOrder = {
  value: "DESC",
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    orderAction: (_, action) => ({ value: action.payload }),
  },
});

export default orderSlice.reducer;
export const orderSelector = (state: RootState) => state.order.value;
export const { orderAction } = orderSlice.actions;
