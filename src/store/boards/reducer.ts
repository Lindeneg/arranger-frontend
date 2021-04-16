import { createReducer, ActionReducerMapBuilder, PayloadAction } from '@reduxjs/toolkit';

import { BoardState } from './types';
import { ResponseError } from '../../common/types';
import {
    fetchBoardsStart,
    fetchBoardsSuccess,
    fetchBoardsError,
    fetchBoardStart,
    fetchBoardSuccess,
    fetchBoardError,
    createBoardStart,
    createBoardSuccess,
    createBoardError,
    updateBoardStart,
    /*     updateBoardSuccess, */
    updateBoardError,
    deleteBoardStart,
    /*     deleteBoardSuccess, */
    deleteBoardError,
    clearAnyBoardError
} from './actions';

const initialState: BoardState = {
    board: null,
    boards: null,
    requested: false,
    requesting: false,
    error: null
};

export default createReducer(initialState, (builder: ActionReducerMapBuilder<BoardState>) => {
    builder.addCase(fetchBoardsSuccess, (state, action) => {
        return {
            ...state,
            boards: action.payload,
            requested: true,
            requesting: false
        };
    });
    builder.addCase(fetchBoardSuccess, (state, action) => {
        return {
            ...state,
            board: action.payload,
            requested: true,
            requesting: false
        };
    });
    builder.addCase(createBoardSuccess, (state, action) => {
        const currentBoards = state.boards !== null ? state.boards : [];
        return {
            ...state,
            boards: [...currentBoards, action.payload],
            requested: true,
            requesting: false
        };
    });
    builder.addCase(clearAnyBoardError, (state) => {
        console.log('clear 2');
        return {
            ...state,
            error: null
        };
    });
    builder.addCase(fetchBoardsError, (state, action) => {
        return {
            ...state,
            boards: [],
            requested: true,
            requesting: false,
            error: action.payload.message
        };
    });
    builder.addMatcher(
        (ac) => [fetchBoardsStart.type, fetchBoardStart.type].includes(ac.type),
        (state) => {
            return {
                ...state,
                board: null,
                boards: null,
                requesting: true,
                requested: false,
                error: null
            };
        }
    );
    builder.addMatcher(
        (ac) =>
            [createBoardStart.type, updateBoardStart.type, deleteBoardStart.type].includes(ac.type),
        (state) => {
            return {
                ...state,
                requesting: true,
                requested: false,
                error: null
            };
        }
    );
    builder.addMatcher<PayloadAction<ResponseError>>(
        (ac) =>
            [
                fetchBoardError.type,
                createBoardError.type,
                updateBoardError.type,
                deleteBoardError.type
            ].includes(ac.type),
        (state, action) => {
            return {
                ...state,
                requested: true,
                requesting: false,
                error: action.payload.message
            };
        }
    );
});
