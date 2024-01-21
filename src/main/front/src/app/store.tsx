import { configureStore, combineReducers } from '@reduxjs/toolkit';
import categoriesReducer from './slices/categoriesSlice';
import userReducer from './slices/userSlice';

const eventReducer = function(state = { event: false }, action: { type: any; }) {
  switch(action.type){
    case "INSERT_LEDGER":
      console.log(state.event);
      return {...state , event : !state.event}
    default:
      return state
  }
}

const rootReducer = combineReducers({
  categories: categoriesReducer,
  user: userReducer,
  event: eventReducer
});

export const store = configureStore({
  reducer: rootReducer
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
