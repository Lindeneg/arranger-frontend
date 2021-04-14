import { createAction } from '@reduxjs/toolkit';
import axios from '../../axios-base';

import { AppDispatch } from '..';
import { Board, BoardPayload } from './types';
import { ResponseError, getAuthHeader, getError } from '../../common';
import { List } from '../lists/types';

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
        const { data } = await axios.get<Board<string>[]>('/api/boards', getAuthHeader());
        dispatch(fetchBoardsSuccess(data));
    } catch (err) {
        dispatch(fetchBoardsError(getError(err)));
    }
};

export const getBoard = (boardId: string) => async (dispatch: AppDispatch): Promise<void> => {
    dispatch(fetchBoardStart());
    try {
        const { data } = await axios.get<Board<List>>('/api/boards/' + boardId, getAuthHeader());
        // TODO init lists
        dispatch(fetchBoardSuccess(data));
    } catch (err) {
        dispatch(fetchBoardError(err.response.data));
    }
};

export const deleteBoard = (boardId: string) => async (dispatch: AppDispatch): Promise<void> => {
    dispatch(deleteBoardStart());
    try {
        const { data } = await axios.delete<Board<List>>('/api/boards/' + boardId, getAuthHeader());
        dispatch(deleteBoardSuccess(data));
    } catch (err) {
        dispatch(deleteBoardError(err.response.data));
    }
};

export const createBoard = (payload: BoardPayload<'name' | 'owner'>) => async (
    dispatch: AppDispatch
): Promise<void> => {
    dispatch(createBoardStart());
    try {
        const { data } = await axios.post<Board<string>>('/api/boards', payload, getAuthHeader());
        dispatch(createBoardSuccess(data));
    } catch (err) {
        dispatch(createBoardError(err.response.data));
    }
};

export const updateBoard = (boardId: string, payload: BoardPayload<'name' | 'lists' | 'listOrder'>) => async (
    dispatch: AppDispatch
): Promise<void> => {
    dispatch(updateBoardStart());
    try {
        const { data } = await axios.patch<Board<List>>('/api/boards/' + boardId, payload, getAuthHeader());
        dispatch(updateBoardSuccess(data));
    } catch (err) {
        dispatch(updateBoardError(err.response.data));
    }
};

export const clearBoardError = () => async (dispatch: AppDispatch): Promise<void> => {
    dispatch(clearAnyBoardError());
};
