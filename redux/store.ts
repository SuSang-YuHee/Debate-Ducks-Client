import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import example from "./modules/example";

const store = configureStore({
  reducer: {
    example,
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
