import { RootState } from "../store";
import { createSlice } from "@reduxjs/toolkit";

export interface IScrollMain {
  value: number;
}

const initialState: IScrollMain = {
  value: 0,
};

const scrollMainSlice = createSlice({
  name: "scrollMain",
  initialState,
  reducers: {
    scrollMainAction: (_, action) => ({ value: action.payload }),
  },
});

export default scrollMainSlice.reducer;
export const scrollMainSelector = (state: RootState) => state.scrollMain.value;
export const { scrollMainAction } = scrollMainSlice.actions;
