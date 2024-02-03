import { configureStore, combineReducers } from '@reduxjs/toolkit';
import categoriesReducer from './slices/categoriesSlice';
import userReducer from './slices/userSlice';
import ledgerReducer from './slices/ledgerSilce';
import loginUserReducer from './slices/loginUserSlice';

const rootReducer = combineReducers({
  categories: categoriesReducer,
  user: userReducer,
  ledger: ledgerReducer,
  loginUser: loginUserReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
