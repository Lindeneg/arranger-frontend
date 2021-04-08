import { createAction } from '@reduxjs/toolkit';
import axios from '../../axios-base';

import { AppDispatch } from '..';
import { AuthResponse, User, UserPayload } from './types';
import { ResponseError, StoredData } from '../../common/types';
import { isResponseOk, removeLocalV, setLocalV } from '../../common/func';

export const createUserStart = createAction('CREATE_USER_START');
export const createUserSuccess = createAction<AuthResponse>('CREATE_USER_SUCCESS');
export const createUserError = createAction<ResponseError>('CREATE_USER_ERROR');

export const updateUserStart = createAction('UPDATE_USER_START');
export const updateUserSuccess = createAction<AuthResponse>('UPDATE_USER_SUCCESS');
export const updateUserError = createAction<ResponseError>('UPDATE_USER_ERROR');

export const deleteUserStart = createAction('DELETE_USER_START');
export const deleteUserSuccess = createAction('DELETE_USER_SUCCESS');
export const deleteUserError = createAction<ResponseError>('DELETE_USER_ERROR');

export const loginUserStart = createAction('LOGIN_USER_START');
export const loginUserSuccess = createAction<AuthResponse>('LOGIN_USER_SUCCESS');
export const loginUserError = createAction<ResponseError>('LOGIN_USER_ERROR');

export const logoutUserStart = createAction('LOGOUT_USER');

export const clearAnyAuthError = createAction('CLEAR_ANY_AUTH_ERROR');

export const createUser = (user: User) => async (dispatch: AppDispatch): Promise<void> => {
    dispatch(createUserStart());
    try {
        const { status, data } = await axios.post<AuthResponse>('/api/user/signup', user);
        if (!isResponseOk(status)) {
            throw new Error(data.toString());
        }
        setLocalV({ _id: data.userId, _token: data.token, _expires: data.expires });
        dispatch(createUserSuccess(data));
    } catch (err) {
        dispatch(createUserError(err));
    }
};

export const updateUser = (payload: UserPayload) => async (dispatch: AppDispatch): Promise<void> => {};

export const deleteUser = () => async (dispatch: AppDispatch): Promise<void> => {
    dispatch(deleteUserStart());
    try {
        const { status, data } = await axios.delete<AuthResponse>('/api/user');
        if (!isResponseOk(status)) {
            throw new Error(data.toString());
        }
        removeLocalV();
        dispatch(deleteUserSuccess());
    } catch (err) {
        dispatch(deleteUserError(err));
    }
};

export const loginUser = (user: User | null, localUser?: StoredData) => async (
    dispatch: AppDispatch
): Promise<void> => {
    dispatch(loginUserStart());
    if (user !== null) {
        try {
            const { status, data } = await axios.post<AuthResponse>('/api/user/login', user);
            if (!isResponseOk(status)) {
                throw new Error(data.toString());
            }
            setLocalV({ _id: data.userId, _token: data.token, _expires: data.expires });
            dispatch(loginUserSuccess(data));
        } catch (err) {
            dispatch(loginUserError(err));
        }
    } else if (typeof localUser !== 'undefined') {
        dispatch(loginUserSuccess({ token: localUser._token, userId: localUser._id, expires: localUser._expires }));
    } else {
        dispatch(loginUserError({ message: 'invalid login arguments provided' }));
    }
};

export const logoutUser = () => async (dispatch: AppDispatch): Promise<void> => {
    removeLocalV();
    dispatch(logoutUserStart());
};

export const clearAuthError = () => async (dispatch: AppDispatch): Promise<void> => {
    dispatch(clearAnyAuthError());
};
