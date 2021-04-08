import { createAction } from '@reduxjs/toolkit';
import axios from '../../axios-base';

import { AppDispatch } from '..';
import { Board, BoardPayload } from './types';
import { List } from '../lists/types';
import { ResponseError } from '../../common/types';
import { getAuthHeader, isResponseOk } from '../../common/func';

export const fetchBoardsStart = createAction('FETCH_BOARDS_START');
export const fetchBoardsSuccess = createAction<Board<string>[]>('FETCH_BOARDS_SUCCESS');
export const fetchBoardsError = createAction<ResponseError>('FETCH_BOARDS_ERROR');

export const fetchBoardStart = createAction('FETCH_BOARD_START');
export const fetchBoardSuccess = createAction<Board<List>>('FETCH_BOARD_SUCCESS');
export const fetchBoardError = createAction<ResponseError>('FETCH_BOARD_ERROR');

export const createBoardStart = createAction('CREATE_BOARD_START');
export const createBoardSuccess = createAction<Board<string>>('CREATE_BOARD_SUCCESS');
export const createBoardError = createAction<ResponseError>('CREATE_BOARD_ERROR');

export const deleteBoardStart = createAction('DELETE_BOARD_START');
export const deleteBoardSuccess = createAction<Board<List>>('DELETE_BOARD_SUCCESS');
export const deleteBoardError = createAction<ResponseError>('DELETE_BOARD_ERROR');

export const updateBoardStart = createAction('UPDATE_BOARD_START');
export const updateBoardSuccess = createAction<Board<List>>('UPDATE_BOARD_SUCCESS');
export const updateBoardError = createAction<ResponseError>('UPDATE_BOARD_ERROR');

export const clearAnyBoardError = createAction('CLEAR_ANY_BOARD_ERROR');

export const getBoards = () => async (dispatch: AppDispatch): Promise<void> => {
    dispatch(fetchBoardsStart());
    try {
        const { status, data } = await axios.get<Board<string>[]>('/api/boards', getAuthHeader());
        if (!isResponseOk(status)) {
            throw new Error(data.toString());
        }
        dispatch(fetchBoardsSuccess(data));
    } catch (err) {
        dispatch(fetchBoardsError(err));
    }
};

export const getBoard = (boardId: string) => async (dispatch: AppDispatch): Promise<void> => {
    dispatch(fetchBoardStart());
    try {
        const { status, data } = await axios.get<Board<List>>('/api/boards/' + boardId, getAuthHeader());
        if (!isResponseOk(status)) {
            throw new Error(data.toString());
        }
        // TODO init lists
        dispatch(fetchBoardSuccess(data));
    } catch (err) {
        dispatch(fetchBoardError(err));
    }
};

export const deleteBoard = (boardId: string) => async (dispatch: AppDispatch): Promise<void> => {
    dispatch(deleteBoardStart());
    try {
        const { status, data } = await axios.delete<Board<List>>('/api/boards/' + boardId, getAuthHeader());
        if (!isResponseOk(status)) {
            throw new Error(data.toString());
        }
        dispatch(deleteBoardSuccess(data));
    } catch (err) {
        dispatch(deleteBoardError(err));
    }
};

export const createBoard = (payload: BoardPayload<'name' | 'owner' | 'theme'>) => async (
    dispatch: AppDispatch
): Promise<void> => {
    dispatch(createBoardStart());
    try {
        const { status, data } = await axios.post<Board<string>>('/api/boards', payload, getAuthHeader());
        if (!isResponseOk(status)) {
            throw new Error(data.toString());
        }
        dispatch(createBoardSuccess(data));
    } catch (err) {
        dispatch(createBoardError(err));
    }
};

export const updateBoard = (boardId: string, payload: BoardPayload<'name' | 'theme'>) => async (
    dispatch: AppDispatch
): Promise<void> => {
    dispatch(updateBoardStart());
    try {
        const { status, data } = await axios.patch<Board<List>>('/api/boards/' + boardId, payload, getAuthHeader());
        if (!isResponseOk(status)) {
            throw new Error(data.toString());
        }
        dispatch(updateBoardSuccess(data));
    } catch (err) {
        dispatch(updateBoardError(err));
    }
};

export const clearBoardError = () => async (dispatch: AppDispatch): Promise<void> => {
    dispatch(clearAnyBoardError());
};
