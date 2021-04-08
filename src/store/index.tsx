import { combineReducers, configureStore } from '@reduxjs/toolkit';
import reduxThunk from 'redux-thunk';

import boardReducer from './boards/reducer';

export const rootReducer = combineReducers({
    board: boardReducer
});

const store = configureStore({
    reducer: rootReducer,
    middleware: [reduxThunk as any]
});

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof rootReducer>;

export default store;
