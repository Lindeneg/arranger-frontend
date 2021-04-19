import { createReducer, ActionReducerMapBuilder, PayloadAction } from '@reduxjs/toolkit';

import { CardState } from './types';
import {
    initCardStart,
    deselectCardStart,
    createCardStart,
    createCardSuccess,
    createCardError,
    updateCardStart,
    updateCardSuccess,
    updateCardError,
    deleteCardStart,
    deleteCardSuccess,
    deleteCardError,
    clearAnyCardError
} from './actions';
import { ResponseError } from '../../common/types';

const initialState: CardState = {
    card: null,
    requested: false,
    requesting: false,
    error: null
};

export default createReducer(initialState, (builder: ActionReducerMapBuilder<CardState>) => {
    builder.addCase(initCardStart, (state, action) => {
        return {
            ...state,
            card: action.payload
        };
    });
    builder.addCase(deselectCardStart, (state) => {
        return {
            ...state,
            card: null
        };
    });
    builder.addCase(updateCardStart, (state, action) => {
        const newState = { ...state };
        if (newState.card) {
            newState.card = {
                ...newState.card,
                ...action.payload
            };
        }
        return {
            ...newState,
            requesting: true,
            requested: false,
            error: null
        };
    });
    builder.addCase(deleteCardSuccess, (state) => {
        return {
            ...state,
            card: null,
            requested: true,
            requesting: false
        };
    });
    builder.addCase(clearAnyCardError, (state) => {
        return {
            ...state,
            error: null
        };
    });
    builder.addMatcher(
        (ac) => [createCardSuccess.type, updateCardSuccess.type].includes(ac.type),
        (state) => {
            return {
                ...state,
                requested: true,
                requesting: false
            };
        }
    );
    builder.addMatcher(
        (ac) => [createCardStart.type, deleteCardStart.type].includes(ac.type),
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
            [createCardError.type, updateCardError.type, deleteCardError.type].includes(ac.type),
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
