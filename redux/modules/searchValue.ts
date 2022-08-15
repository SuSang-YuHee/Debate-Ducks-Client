import { RootState } from "../store";
import { createSlice } from "@reduxjs/toolkit";

export interface ISearchValue {
  value: string;
}

const initialState: ISearchValue = {
  value: "",
};

const searchValueSlice = createSlice({
  name: "searchValue",
  initialState,
  reducers: {
    searchValueAction: (_, action) => ({ value: action.payload }),
  },
});

export default searchValueSlice.reducer;
export const searchValueSelector = (state: RootState) =>
  state.searchValue.value;
export const { searchValueAction } = searchValueSlice.actions;
