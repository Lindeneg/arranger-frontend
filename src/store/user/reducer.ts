import { createReducer, ActionReducerMapBuilder, PayloadAction } from '@reduxjs/toolkit';

import { UserResponse, UserState } from './types';
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
    clearAnyUserError
} from './actions';
import { ResponseError } from '../../common/types';
import { defaultTheme } from '../../common/values';

const initialState: UserState = {
    userId: null,
    token: null,
    theme: defaultTheme,
    requested: false,
    requesting: false,
    error: null
};

export default createReducer(initialState, (builder: ActionReducerMapBuilder<UserState>) => {
    builder.addCase(logoutUserStart, (state) => {
        return {
            ...state,
            theme: defaultTheme,
            userId: null,
            token: null
        };
    });
    builder.addCase(clearAnyUserError, (state) => {
        return {
            ...state,
            error: null
        };
    });
    builder.addMatcher(
        (ac) => [createUserStart.type, loginUserStart.type].includes(ac.type),
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
    builder.addMatcher<PayloadAction<UserResponse>>(
        (ac) => [createUserSuccess.type, loginUserSuccess.type].includes(ac.type),
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
        (ac) => [createUserError.type, loginUserError.type].includes(ac.type),
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
