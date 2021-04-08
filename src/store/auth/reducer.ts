import { createReducer, ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { AuthState } from './types';

import {
    createUserStart,
    createUserSuccess,
    createUserError,
    updateUserStart,
    updateUserSuccess,
    updateUserError,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserError,
    loginUserStart,
    loginUserSuccess,
    loginUserError,
    logoutUserStart
} from './actions';

const initialState: AuthState = {
    userId: null,
    token: null,
    requested: false,
    requesting: false,
    error: null
};

export default createReducer(initialState, (builder: ActionReducerMapBuilder<AuthState>) => {
    builder.addCase(createUserStart, (state) => {
        return {
            ...state,
            userId: null,
            token: null,
            requesting: true,
            requested: false,
            error: null
        };
    });
    builder.addCase(createUserSuccess, (state, action) => {
        return {
            ...state,
            ...action.payload,
            requesting: false,
            requested: true
        };
    });
    builder.addCase(createUserError, (state, action) => {
        return {
            ...state,
            requesting: false,
            requested: true,
            error: action.payload.message
        };
    });
    builder.addCase(loginUserStart, (state) => {
        return {
            ...state,
            userId: null,
            token: null,
            requesting: true,
            requested: false,
            error: null
        };
    });
    builder.addCase(loginUserSuccess, (state, action) => {
        return {
            ...state,
            ...action.payload,
            requesting: false,
            requested: true
        };
    });
    builder.addCase(loginUserError, (state, action) => {
        return {
            ...state,
            requesting: false,
            requested: true,
            error: action.payload.message
        };
    });
    builder.addCase(logoutUserStart, (state) => {
        return {
            ...state,
            userId: null,
            token: null
        };
    });
});
