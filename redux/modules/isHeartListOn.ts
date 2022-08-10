import { RootState } from "../store";
import { createSlice } from "@reduxjs/toolkit";

export interface IIsHeartListOn {
  value: boolean;
}

const initialState: IIsHeartListOn = {
  value: false,
};

const isHeartListOnSlice = createSlice({
  name: "isHeartListOn",
  initialState,
  reducers: {
    isHeartListOnAction: (_, action) => ({ value: action.payload }),
  },
});

export default isHeartListOnSlice.reducer;
export const isHeartListOnSelector = (state: RootState) =>
  state.isHeartListOn.value;
export const { isHeartListOnAction } = isHeartListOnSlice.actions;
