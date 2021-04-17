import { combineReducers, configureStore } from '@reduxjs/toolkit';
import reduxThunk from 'redux-thunk';

import boardReducer from './boards/reducer';
import userReducer from './user/reducer';
import listReducer from './lists/reducer';

export const rootReducer = combineReducers({
    board: boardReducer,
    user: userReducer,
    list: listReducer
});

const store = configureStore({
    reducer: rootReducer,
    middleware: [reduxThunk]
});

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof rootReducer>;

export default store;
