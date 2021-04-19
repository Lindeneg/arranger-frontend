import { createReducer, ActionReducerMapBuilder, PayloadAction } from '@reduxjs/toolkit';

import { ListState } from './types';
import {
    initLists,
    createListStart,
    updateListStart,
    deleteListStart,
    createListError,
    updateListError,
    deleteListError,
    clearAnyListError,
    createListSuccess,
    deleteListSuccess,
    updateListSuccess,
    addCardToList,
    updateCardInList,
    updateListCardOrderStart,
    updateListCardOrderSuccess,
    updateListCardOrderError,
    removeCardFromList
} from './actions';
import { ResponseError } from '../../common/types';

const initialState: ListState = {
    lists: [],
    requested: false,
    requesting: false,
    error: null
};

export default createReducer(initialState, (builder: ActionReducerMapBuilder<ListState>) => {
    builder.addCase(initLists, (state, action) => {
        return {
            ...state,
            lists: action.payload
        };
    });
    builder.addCase(updateListCardOrderStart, (state, action) => {
        const newLists = [...state.lists];
        const { src, des } = action.payload;
        newLists[src.idx] = {
            ...newLists[src.idx],
            cards: src.cards,
            cardOrder: src.cardOrder
        };
        if (src.idx !== des.idx) {
            newLists[des.idx] = {
                ...newLists[des.idx],
                cards: des.cards,
                cardOrder: des.cardOrder
            };
        }
        return {
            ...state,
            lists: newLists,
            requesting: true,
            requested: false,
            error: null
        };
    });
    builder.addCase(addCardToList, (state, action) => {
        const newState = { ...state };
        const newLists = [...newState.lists];
        const listEntryIdx = newLists.findIndex((list) => list._id === action.payload.owner);
        if (listEntryIdx > -1) {
            newLists[listEntryIdx] = {
                ...newLists[listEntryIdx],
                cards: [...newLists[listEntryIdx].cards, action.payload],
                cardOrder: [...newLists[listEntryIdx].cardOrder, action.payload._id]
            };
        }
        return { ...newState, lists: newLists };
    });
    builder.addCase(updateCardInList, (state, action) => {
        const newState = { ...state };
        const listEntryIdx = newState.lists.findIndex((list) => list._id === action.payload.owner);
        if (listEntryIdx > -1) {
            const newLists = [...newState.lists];
            const newListCards = [...newLists[listEntryIdx].cards];
            const cardIdx = newLists[listEntryIdx].cards.findIndex(
                (card) => card._id === action.payload._id
            );
            if (cardIdx > -1) {
                newListCards[cardIdx] = {
                    ...newListCards[cardIdx],
                    ...action.payload
                };
                newLists[listEntryIdx] = {
                    ...newLists[listEntryIdx],
                    cards: newListCards
                };
                return {
                    ...newState,
                    lists: newLists
                };
            }
        }
        return newState;
    });
    builder.addCase(removeCardFromList, (state, action) => {
        const newState = { ...state };
        const newLists = [...newState.lists];
        const listEntryIdx = newLists.findIndex((list) => list._id === action.payload.owner);
        if (listEntryIdx > -1) {
            newLists[listEntryIdx] = {
                ...newLists[listEntryIdx],
                cards: newLists[listEntryIdx].cards.filter(
                    (card) => card._id !== action.payload._id
                ),
                cardOrder: newLists[listEntryIdx].cardOrder.filter(
                    (cardId) => cardId !== action.payload._id
                )
            };
        }
        return { ...newState, lists: newLists };
    });
    builder.addCase(createListSuccess, (state, action) => {
        return {
            ...state,
            lists: [...state.lists, action.payload],
            requested: true,
            requesting: false
        };
    });
    builder.addCase(updateListStart, (state, action) => {
        const newLists = [...state.lists];
        const targetIdx = state.lists.findIndex((list) => list._id === action.payload._id);
        if (targetIdx > -1) {
            newLists[targetIdx] = {
                ...newLists[targetIdx],
                name: action.payload.name
            };
        }
        return {
            ...state,
            lists: newLists,
            requested: false,
            requesting: true,
            error: null
        };
    });
    builder.addCase(clearAnyListError, (state) => {
        return {
            ...state,
            error: null
        };
    });
    builder.addCase(deleteListStart, (state, action) => {
        return {
            ...state,
            lists: state.lists.filter((list) => list._id !== action.payload._id),
            requesting: true,
            requested: false,
            error: null
        };
    });
    builder.addCase(createListStart, (state) => {
        return {
            ...state,
            requesting: true,
            requested: false,
            error: null
        };
    });
    builder.addMatcher(
        (ac) =>
            [
                deleteListSuccess.type,
                updateListSuccess.type,
                updateListCardOrderSuccess.type
            ].includes(ac.type),
        (state) => {
            return {
                ...state,
                requesting: false,
                requested: true
            };
        }
    );
    builder.addMatcher<PayloadAction<ResponseError>>(
        (ac) =>
            [
                createListError.type,
                updateListError.type,
                deleteListError.type,
                updateListCardOrderError.type
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
