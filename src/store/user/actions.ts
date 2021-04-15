import { createAction } from '@reduxjs/toolkit';
import axios from '../../axios-base';

import { AppDispatch } from '..';
import { UserResponse, User, UserPayload } from './types';
import { defaultTheme } from '../../common/values';
import { ResponseError, StoredData } from '../../common/types';
import {
    devLog,
    getAuthHeader,
    getError,
    getLocalV,
    removeLocalV,
    setLocalV
} from '../../common/func';

export const createUserStart = createAction('CREATE_USER_START');
export const createUserSuccess = createAction<UserResponse>('CREATE_USER_SUCCESS');
export const createUserError = createAction<ResponseError>('CREATE_USER_ERROR');

export const updateUserStart = createAction('UPDATE_USER_START');
export const updateUserSuccess = createAction<UserResponse>('UPDATE_USER_SUCCESS');
export const updateUserError = createAction<ResponseError>('UPDATE_USER_ERROR');

export const deleteUserStart = createAction('DELETE_USER_START');
export const deleteUserSuccess = createAction('DELETE_USER_SUCCESS');
export const deleteUserError = createAction<ResponseError>('DELETE_USER_ERROR');

export const loginUserStart = createAction('LOGIN_USER_START');
export const loginUserSuccess = createAction<UserResponse>('LOGIN_USER_SUCCESS');
export const loginUserError = createAction<ResponseError>('LOGIN_USER_ERROR');

export const switchUserThemeStart = createAction<UserPayload<'theme'>>('SWITCH_USER_THEME_START');
export const switchUserThemeSuccess = createAction('SWITCH_USER_THEME_SUCCESS');
export const switchUserThemeError = createAction('SWITCH_USER_THEME_ERROR');

export const logoutUserStart = createAction('LOGOUT_USER');

export const clearAnyUserError = createAction('CLEAR_ANY_USER_ERROR');

export const createUser = (user: Omit<User, '_id'>) => async (
    dispatch: AppDispatch
): Promise<void> => {
    dispatch(createUserStart());
    try {
        const { data } = await axios.post<UserResponse>('/api/user/signup', {
            ...user,
            theme: defaultTheme
        });
        setLocalV({
            _id: data.userId,
            _token: data.token,
            _theme: defaultTheme,
            _expires: data.expires
        });
        dispatch(createUserSuccess(data));
    } catch (err) {
        dispatch(createUserError(getError(err)));
    }
};

export const updateUser = (payload: UserPayload<'password'>) => async (
    dispatch: AppDispatch
): Promise<void> => {
    dispatch(updateUserStart());
    try {
        const { data } = await axios.patch<UserResponse>('/api/user', payload, getAuthHeader());
        dispatch(updateUserSuccess(data));
    } catch (err) {
        dispatch(updateUserError(getError(err)));
    }
};

export const switchUserTheme = (payload: UserPayload<'theme'>) => async (
    dispatch: AppDispatch
): Promise<void> => {
    dispatch(switchUserThemeStart(payload));
    setLocalV({ ...getLocalV(), _theme: payload.theme });
    try {
        await axios.patch<UserResponse>('/api/user', payload, getAuthHeader());
        dispatch(switchUserThemeSuccess());
    } catch (err) {
        dispatch(switchUserThemeError());
        devLog(err);
    }
};

export const deleteUser = () => async (dispatch: AppDispatch): Promise<void> => {
    dispatch(deleteUserStart());
    try {
        await axios.delete<UserResponse>('/api/user', getAuthHeader());
        removeLocalV();
        dispatch(deleteUserSuccess());
    } catch (err) {
        dispatch(deleteUserError(getError(err)));
    }
};

export const loginUser = (user: Omit<User, '_id'> | null, localUser?: StoredData) => async (
    dispatch: AppDispatch
): Promise<void> => {
    dispatch(loginUserStart());
    if (user !== null) {
        try {
            const { data } = await axios.post<UserResponse>('/api/user/login', user);
            setLocalV({
                _id: data.userId,
                _token: data.token,
                _theme: data.theme,
                _expires: data.expires
            });
            dispatch(loginUserSuccess(data));
        } catch (err) {
            dispatch(loginUserError(getError(err)));
        }
    } else if (typeof localUser !== 'undefined') {
        dispatch(
            loginUserSuccess({
                token: localUser._token,
                userId: localUser._id,
                theme: localUser._theme,
                expires: localUser._expires
            })
        );
    } else {
        dispatch(loginUserError({ message: 'invalid login arguments provided' }));
    }
};

export const logoutUser = () => async (dispatch: AppDispatch): Promise<void> => {
    removeLocalV();
    dispatch(logoutUserStart());
};

export const clearUserError = () => async (dispatch: AppDispatch): Promise<void> => {
    dispatch(clearAnyUserError());
};
