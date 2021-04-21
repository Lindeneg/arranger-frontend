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
    addChecklistToCard,
    updateChecklistInCard,
    removeChecklistFromCard,
    updateCardChecklistOrderStart,
    updateCardChecklistOrderSuccess,
    updateCardChecklistOrderError,
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
    builder.addCase(addChecklistToCard, (state, action) => {
        let card = state.card;
        if (card) {
            card = {
                ...card,
                checklists: [...card.checklists, action.payload],
                checklistOrder: [...card.checklistOrder, action.payload._id]
            };
        }
        return {
            ...state,
            card
        };
    });
    builder.addCase(updateCardChecklistOrderStart, (state, action) => {
        let card = state.card;
        if (!!card && !!action.payload.checklistOrder) {
            card = {
                ...card,
                ...action.payload
            };
        }
        return {
            ...state,
            card,
            error: null
        };
    });
    builder.addCase(updateCardChecklistOrderSuccess, (state) => {
        return state;
    });
    builder.addCase(updateChecklistInCard, (state, action) => {
        let card = state.card;
        if (card) {
            const idx = card.checklists.findIndex((cl) => cl._id === action.payload._id);
            if (idx > -1) {
                const newChecklists = [...card.checklists];
                newChecklists[idx] = {
                    ...newChecklists[idx],
                    ...action.payload
                };
                card = {
                    ...card,
                    checklists: newChecklists
                };
            }
        }
        return {
            ...state,
            card
        };
    });
    builder.addCase(removeChecklistFromCard, (state, action) => {
        let card = state.card;
        if (card) {
            card = {
                ...card,
                checklists: card.checklists.filter((cl) => cl._id !== action.payload._id),
                checklistOrder: card.checklistOrder.filter((id) => id !== action.payload._id)
            };
        }
        return {
            ...state,
            card
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
            [
                createCardError.type,
                updateCardError.type,
                deleteCardError.type,
                updateCardChecklistOrderError.type
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
