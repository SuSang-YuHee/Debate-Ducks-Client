import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import statuses from "./modules/statuses";
import categories from "./modules/categories";
import order from "./modules/order";
import heartOrder from "./modules/heartOrder";
import isHeartListOn from "./modules/isHeartListOn";
import isSearchListOn from "./modules/isSearchListOn";
import searchValue from "./modules/searchValue";
import scrollMain from "./modules/scrollMain";

const store = configureStore({
  reducer: {
    statuses,
    categories,
    order,
    heartOrder,
    isHeartListOn,
    isSearchListOn,
    searchValue,
    scrollMain,
  },
});

export default store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
