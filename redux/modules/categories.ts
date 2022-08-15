import { RootState } from "../store";
import { createSlice } from "@reduxjs/toolkit";

export interface ICategories {
  value: string[];
}

const initialState: ICategories = {
  value: [],
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    categoriesAction: (_, action) => ({ value: action.payload }),
  },
});

export default categoriesSlice.reducer;
export const categoriesSelector = (state: RootState) => state.categories.value;
export const { categoriesAction } = categoriesSlice.actions;
