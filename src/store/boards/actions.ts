import { createAction } from '@reduxjs/toolkit';
import axios from '../../axios-base';

import { AppDispatch } from '..';
import { Board, BoardPayload } from './types';
import { ResponseError } from '../../common/types';
import { List } from '../lists/types';
import { isResponseOk } from '../../common/func';

export const fetchBoardsStart = createAction('FETCH_BOARDS_START');
export const fetchBoardsSuccess = createAction<Board<string>[]>('FETCH_BOARDS_SUCCESS');
export const fetchBoardsError = createAction<ResponseError>('FETCH_BOARDS_ERROR');

export const fetchBoardStart = createAction('FETCH_BOARD_START');
export const fetchBoardSuccess = createAction<Board<List>>('FETCH_BOARD_SUCCESS');
export const fetchBoardError = createAction<ResponseError>('FETCH_BOARD_ERROR');

export const createBoardStart = createAction('CREATE_BOARD_START');
export const createBoardSuccess = createAction<Board<List>>('CREATE_BOARD_SUCCESS');
export const createBoardError = createAction<ResponseError>('CREATE_BOARD_ERROR');

export const deleteBoardStart = createAction('DELETE_BOARD_START');
export const deleteBoardSuccess = createAction<Board<List>>('DELETE_BOARD_SUCCESS');
export const deleteBoardError = createAction<ResponseError>('DELETE_BOARD_ERROR');

export const updateBoardStart = createAction('UPDATE_BOARD_START');
export const updateBoardSuccess = createAction<Board<List>>('UPDATE_BOARD_SUCCESS');
export const updateBoardError = createAction<ResponseError>('UPDATE_BOARD_ERROR');

export const getBoards = (userId: string) => async (dispatch: AppDispatch): Promise<void> => {
    dispatch(fetchBoardsStart());
    try {
        const { status, data } = await axios.get<Board<string>[]>('/api/boards/user/' + userId);
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
        const { status, data } = await axios.get<Board<List>>('/api/boards/' + boardId);
        if (!isResponseOk(status)) {
            throw new Error(data.toString());
        }
        // init lists
        dispatch(fetchBoardSuccess(data));
    } catch (err) {
        dispatch(fetchBoardError(err));
    }
};

export const createBoard = (payload: BoardPayload<'name' | 'owner' | 'theme'>) => async (
    dispatch: AppDispatch
): Promise<void> => {};

export const deleteBoard = (payload: BoardPayload<'_id'>) => async (dispatch: AppDispatch): Promise<void> => {};

export const updateBoard = (payload: BoardPayload<'name' | 'theme'>) => async (
    dispatch: AppDispatch
): Promise<void> => {};
