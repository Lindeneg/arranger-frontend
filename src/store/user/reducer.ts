import { createReducer, ActionReducerMapBuilder, PayloadAction } from '@reduxjs/toolkit';

import { UserResponse, UserState } from './types';
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
    logoutUserStart,
    switchUserThemeStart,
    switchUserThemeSuccess,
    switchUserThemeError,
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
    builder.addCase(clearAnyUserError, (state) => {
        return {
            ...state,
            error: null
        };
    });
    builder.addCase(updateUserStart, (state) => {
        return {
            ...state,
            requesting: true,
            requested: false,
            error: null
        };
    });
    builder.addCase(switchUserThemeStart, (state, action) => {
        return {
            ...state,
            ...action.payload
        };
    });
    builder.addMatcher(
        (ac) => [logoutUserStart.type, deleteUserSuccess.type].includes(ac.type),
        (state) => {
            return {
                ...state,
                theme: defaultTheme,
                userId: null,
                token: null
            };
        }
    );
    builder.addMatcher(
        (ac) => [createUserStart.type, loginUserStart.type, deleteUserStart.type].includes(ac.type),
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
        (ac) =>
            [createUserSuccess.type, loginUserSuccess.type, updateUserSuccess.type].includes(
                ac.type
            ),
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
        (ac) =>
            [
                createUserError.type,
                loginUserError.type,
                updateUserError.type,
                deleteUserError.type
            ].includes(ac.type),
        (state, action) => {
            return {
                ...state,
                requesting: false,
                requested: true,
                error: action.payload.message
            };
        }
    );
    builder.addMatcher(
        (ac) => [switchUserThemeSuccess, switchUserThemeError].includes(ac.type),
        (state) => {
            return state;
        }
    );
});
