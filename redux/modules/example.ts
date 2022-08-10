import { RootState } from "../store";
import { createSlice } from "@reduxjs/toolkit";

export interface IExample {
  value: string;
}

const initialState: IExample = {
  value: "...",
};

const exampleSlice = createSlice({
  name: "example",
  initialState,
  reducers: {
    actionCreator: (state, action) => {
      // action.payload는 actionCreator의 params
      // state 변경은 mutable, immutable 둘 다 가능
      // state=value로 직접 변경은 안됨
    },
  },
});

export default exampleSlice.reducer;
export const selectExample = (state: RootState) => state.example.value;
export const { actionCreator } = exampleSlice.actions;
