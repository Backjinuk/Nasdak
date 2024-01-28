import { configureStore, combineReducers } from '@reduxjs/toolkit';
import categoriesReducer from './slices/categoriesSlice';
import userReducer from './slices/userSlice';
import ledgerReducer from './slices/ledgerSilce';

const rootReducer = combineReducers({
  categories: categoriesReducer,
  user: userReducer,
  ledger: ledgerReducer
});

export const store = configureStore({
  reducer: rootReducer
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
