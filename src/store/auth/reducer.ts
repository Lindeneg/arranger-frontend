import { createReducer, ActionReducerMapBuilder, PayloadAction } from '@reduxjs/toolkit';

import { AuthResponse, AuthState } from './types';
import {
    createUserStart,
    createUserSuccess,
    createUserError,
    /*     updateUserStart,
    updateUserSuccess,
    updateUserError,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserError, */
    loginUserStart,
    loginUserSuccess,
    loginUserError,
    logoutUserStart,
    clearAnyAuthError
} from './actions';
import { ResponseError } from '../../common/types';

const initialState: AuthState = {
    userId: null,
    token: null,
    requested: false,
    requesting: false,
    error: null
};

export default createReducer(initialState, (builder: ActionReducerMapBuilder<AuthState>) => {
    builder.addCase(logoutUserStart, (state) => {
        return {
            ...state,
            userId: null,
            token: null
        };
    });
    builder.addCase(clearAnyAuthError, (state) => {
        return {
            ...state,
            error: null
        };
    });
    builder.addMatcher(
        (ac) => ac.type in [createUserStart.type, loginUserStart.type],
        (state) => {
            return {
                ...state,
                userId: null,
                token: null,
                requesting: true,
                requested: false,
                error: null
            };
        }
    );
    builder.addMatcher<PayloadAction<AuthResponse>>(
        (ac) => ac.type in [createUserSuccess.type, loginUserSuccess.type],
        (state, action) => {
            return {
                ...state,
                ...action.payload,
                requesting: false,
                requested: true
            };
        }
    );
    builder.addMatcher<PayloadAction<ResponseError>>(
        (ac) => ac.type in [createUserError.type, loginUserError.type],
        (state, action) => {
            return {
                ...state,
                requesting: false,
                requested: true,
                error: action.payload.message
            };
        }
    );
});
