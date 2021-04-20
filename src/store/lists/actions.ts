import { createAction } from '@reduxjs/toolkit';
import axios from '../../axios-base';

import { AppDispatch } from '..';
import { List, ListPayload, ListCardOrderPayload } from './types';
import { addToBoardListOrder, removeFromBoardListOrder } from '../boards/actions';
import { Card, CardPayload } from '../cards/types';
import { getError, getAuthHeader, ResponseError } from '../../common';

export const initLists = createAction<List[]>('INIT_LIST_START');

export const createListStart = createAction('CREATE_LIST_START');
export const createListSuccess = createAction<List>('CREATE_LIST_SUCCESS');
export const createListError = createAction<ResponseError>('CREATE_LIST_ERROR');

export const updateListStart = createAction<ListPayload<'name' | '_id'>>('UPDATE_LIST_START');
export const updateListSuccess = createAction('UPDATE_LIST_SUCCESS');
export const updateListError = createAction<ResponseError>('UPDATE_LIST_ERROR');

export const deleteListStart = createAction<ListPayload<'_id'>>('DELETE_LIST_START');
export const deleteListSuccess = createAction('DELETE_LIST_SUCCESS');
export const deleteListError = createAction<ResponseError>('DELETE_LIST_ERROR');

export const addCardToList = createAction<Card>('ADD_CARD_TO_LIST');
export const updateCardInList = createAction<
    Partial<CardPayload<'_id' | 'owner' | 'name' | 'description' | 'color'>>
>('UPDATE_CARD_IN_LIST');
export const removeCardFromList = createAction<CardPayload<'owner' | '_id'>>(
    'REMOVE_CARD_FROM_LIST'
);

export const updateListCardOrderStart = createAction<ListCardOrderPayload>(
    'UPDATE_LIST_CARD_ORDER_START'
);
export const updateListCardOrderSuccess = createAction('UPDATE_LIST_CARD_ORDER_SUCCESS');
export const updateListCardOrderError = createAction<ResponseError>('UPDATE_LIST_CARD_ORDER_ERROR');

export const clearAnyListError = createAction('CLEAR_ANY_LIST_ERROR');

export const updateListCardOrder = (payload: ListCardOrderPayload | null) => async (
    dispatch: AppDispatch
): Promise<void> => {
    if (payload !== null) {
        dispatch(updateListCardOrderStart(payload));
        try {
            await axios.patch<List>(
                '/api/lists/update/card/order',
                {
                    srcId: payload.src.id,
                    srcOrder: payload.src.cardOrder,
                    desId: payload.des.id,
                    desOrder: payload.des.cardOrder,
                    targetId: payload.targetId
                },
                getAuthHeader()
            );
            dispatch(updateListCardOrderSuccess());
        } catch (err) {
            dispatch(updateListCardOrderError(getError(err)));
        }
    }
};

export const createList = (payload: ListPayload<'name' | 'owner'>) => async (
    dispatch: AppDispatch
): Promise<void> => {
    dispatch(createListStart());
    try {
        const { data } = await axios.post<List>('/api/lists', payload, getAuthHeader());
        dispatch(addToBoardListOrder({ _id: data._id }));
        dispatch(createListSuccess(data));
    } catch (err) {
        dispatch(createListError(getError(err)));
    }
};

export const updateList = (listId: string, payload: ListPayload<'name'>) => async (
    dispatch: AppDispatch
): Promise<void> => {
    dispatch(updateListStart({ ...payload, _id: listId }));
    try {
        await axios.patch<List>('/api/lists/' + listId, payload, getAuthHeader());
        dispatch(updateListSuccess());
    } catch (err) {
        dispatch(updateListError(getError(err)));
    }
};

export const deleteList = (listId: string) => async (dispatch: AppDispatch): Promise<void> => {
    dispatch(deleteListStart({ _id: listId }));
    dispatch(removeFromBoardListOrder({ _id: listId }));
    try {
        await axios.delete<List>('/api/lists/' + listId, getAuthHeader());
        dispatch(deleteListSuccess());
    } catch (err) {
        dispatch(deleteListError(getError(err)));
    }
};
