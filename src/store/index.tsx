import { combineReducers, configureStore } from '@reduxjs/toolkit';
import reduxThunk from 'redux-thunk';

/* import siteReducer from './site/reducer';
import navigationReducer from './navigation/reducer';
import pagesReducer from './pages/reducer'; */

export const rootReducer = combineReducers({
    /*     site: siteReducer,
    navigation: navigationReducer,
    pages: pagesReducer */
});

const store = configureStore({
    reducer: rootReducer,
    middleware: [reduxThunk as any]
});

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof rootReducer>;

export default store;
