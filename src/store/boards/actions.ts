import { createAction } from '@reduxjs/toolkit';
import axios from '../../axios-base';

import { AppDispatch } from '..';
import { Board, BoardPayload } from './types';
import { ResponseError, getAuthHeader, getError } from '../../common';
import { List } from '../lists/types';
import { initLists } from '../lists/actions';

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

export const updateBoardListOrderStart = createAction<BoardPayload<'listOrder'>>(
    'UPDATE_BOARD_LIST_ORDER_START'
);
export const updateBoardListOrderSuccess = createAction('UPDATE_BOARD_LIST_ORDER_SUCCESS');
export const updateBoardListOrderError = createAction<ResponseError>(
    'UPDATE_BOARD_LIST_ORDER_ERROR'
);

export const updateBoardStart = createAction('UPDATE_BOARD_START');
export const updateBoardSuccess = createAction<Board<List>>('UPDATE_BOARD_SUCCESS');
export const updateBoardError = createAction<ResponseError>('UPDATE_BOARD_ERROR');

export const addToBoardListOrder = createAction<BoardPayload<'_id'>>('ADD_TO_BOARD_LIST_ORDER');
export const removeFromBoardListOrder = createAction<BoardPayload<'_id'>>(
    'REMOVE_FROM_BOARD_LIST_ORDER'
);

export const clearAnyBoardError = createAction('CLEAR_ANY_BOARD_ERROR');

export const getBoards = (userId: string) => async (dispatch: AppDispatch): Promise<void> => {
    dispatch(fetchBoardsStart());
    try {
        const { data } = await axios.get<Board<string>[]>(
            '/api/boards/user/' + userId,
            getAuthHeader()
        );
        dispatch(fetchBoardsSuccess(data));
    } catch (err) {
        dispatch(fetchBoardsError(getError(err)));
    }
};

export const getBoard = (boardId: string) => async (dispatch: AppDispatch): Promise<void> => {
    dispatch(fetchBoardStart());
    try {
        const { data } = await axios.get<Board<List>>('/api/boards/' + boardId, getAuthHeader());
        dispatch(fetchBoardSuccess(data));
        dispatch(initLists(data.lists));
    } catch (err) {
        dispatch(fetchBoardError(getError(err)));
    }
};

export const deleteBoard = (boardId: string) => async (dispatch: AppDispatch): Promise<void> => {
    dispatch(deleteBoardStart());
    try {
        const { data } = await axios.delete<Board<List>>('/api/boards/' + boardId, getAuthHeader());
        dispatch(deleteBoardSuccess(data));
    } catch (err) {
        dispatch(deleteBoardError(getError(err)));
    }
};

export const createBoard = (payload: BoardPayload<'name' | 'color'>) => async (
    dispatch: AppDispatch
): Promise<void> => {
    dispatch(createBoardStart());
    try {
        const { data } = await axios.post<Board<string>>('/api/boards', payload, getAuthHeader());
        dispatch(createBoardSuccess(data));
    } catch (err) {
        dispatch(createBoardError(getError(err)));
    }
};

export const updateBoardListOrder = (boardId: string, order: string[]) => async (
    dispatch: AppDispatch
): Promise<void> => {
    dispatch(updateBoardListOrderStart({ listOrder: order }));
    try {
        await axios.patch<Board<List>>(
            '/api/boards/' + boardId,
            { listOrder: order },
            getAuthHeader()
        );
        dispatch(updateBoardListOrderSuccess());
    } catch (err) {
        dispatch(updateBoardListOrderError(getError(err)));
    }
};

export const updateBoard = (boardId: string, payload: BoardPayload<'name' | 'color'>) => async (
    dispatch: AppDispatch
): Promise<void> => {
    dispatch(updateBoardStart());
    try {
        const { data } = await axios.patch<Board<List>>(
            '/api/boards/' + boardId,
            payload,
            getAuthHeader()
        );
        dispatch(updateBoardSuccess(data));
    } catch (err) {
        dispatch(updateBoardError(getError(err)));
    }
};

export const clearBoardError = () => async (dispatch: AppDispatch): Promise<void> => {
    dispatch(clearAnyBoardError());
};
