import { RootState } from "../store";
import { createSlice } from "@reduxjs/toolkit";

export interface IStatures {
  value: string[];
}

const initialState: IStatures = {
  value: [],
};

const statusesSlice = createSlice({
  name: "statuses",
  initialState,
  reducers: {
    statusesAction: (_, action) => ({ value: action.payload }),
  },
});

export default statusesSlice.reducer;
export const statusesSelector = (state: RootState) => state.statuses.value;
export const { statusesAction } = statusesSlice.actions;
