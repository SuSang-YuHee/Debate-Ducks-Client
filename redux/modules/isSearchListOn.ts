import { RootState } from "../store";
import { createSlice } from "@reduxjs/toolkit";

export interface IIsSearchListOn {
  value: boolean;
}

const initialState: IIsSearchListOn = {
  value: false,
};

const isSearchListOnSlice = createSlice({
  name: "isSearchListOn",
  initialState,
  reducers: {
    isSearchListOnAction: (_, action) => ({ value: action.payload }),
  },
});

export default isSearchListOnSlice.reducer;
export const isSearchListOnSelector = (state: RootState) =>
  state.isSearchListOn.value;
export const { isSearchListOnAction } = isSearchListOnSlice.actions;
