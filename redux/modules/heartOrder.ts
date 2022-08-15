import { RootState } from "../store";
import { createSlice } from "@reduxjs/toolkit";

export interface IHeartOrder {
  value: string;
}

const initialState: IHeartOrder = {
  value: "DESC",
};

const heartOrderSlice = createSlice({
  name: "heartOrder",
  initialState,
  reducers: {
    heartOrderAction: (_, action) => ({ value: action.payload }),
  },
});

export default heartOrderSlice.reducer;
export const heartOrderSelector = (state: RootState) => state.heartOrder.value;
export const { heartOrderAction } = heartOrderSlice.actions;
