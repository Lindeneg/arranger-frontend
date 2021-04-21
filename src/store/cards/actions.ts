import { createAction } from '@reduxjs/toolkit';
import axios from '../../axios-base';

import { AppDispatch } from '..';
import { Card, CardPayload } from './types';
import { Checklist, ChecklistPayload } from '../checklists/types';
import { addCardToList, updateCardInList, removeCardFromList } from '../lists/actions';
import { getError, getAuthHeader, ResponseError } from '../../common';

export const initCardStart = createAction<Card>('INIT_CARD_START');
export const deselectCardStart = createAction('DESELECT_CARD_START');

export const createCardStart = createAction('CREATE_CARD_START');
export const createCardSuccess = createAction('CREATE_CARD_SUCCESS');
export const createCardError = createAction<ResponseError>('CREATE_CARD_ERROR');

export const updateCardStart = createAction<
    Partial<CardPayload<'_id' | 'name' | 'description' | 'color'>>
>('UPDATE_CARD_START');
export const updateCardSuccess = createAction('UPDATE_CARD_SUCCESS');
export const updateCardError = createAction<ResponseError>('UPDATE_CARD_ERROR');

export const deleteCardStart = createAction('DELETE_CARD_START');
export const deleteCardSuccess = createAction('DELETE_CARD_SUCCESS');
export const deleteCardError = createAction<ResponseError>('DELETE_CARD_ERROR');

export const addChecklistToCard = createAction<Checklist>('ADD_CHECKLIST_TO_CARD');
export const updateChecklistInCard = createAction<
    Partial<ChecklistPayload<'_id' | 'objective' | 'isCompleted'>>
>('UPDATE_CHECKLIST_IN_CARD');
export const removeChecklistFromCard = createAction<ChecklistPayload<'_id'>>(
    'REMOVE_CHECKLIST_FROM_CARD'
);

export const updateCardChecklistOrderStart = createAction<CardPayload<'checklistOrder'>>(
    'UPDATE_CARD_CHECKLIST_ORDER_START'
);
export const updateCardChecklistOrderSuccess = createAction('UPDATE_CARD_CHECKLIST_ORDER_SUCCESS');
export const updateCardChecklistOrderError = createAction<ResponseError>(
    'UPDATE_CARD_CHECKLIST_ORDER_ERROR'
);

export const clearAnyCardError = createAction('CLEAR_ANY_CARD_ERROR');

export const initCard = (card: Card) => async (dispatch: AppDispatch): Promise<void> => {
    dispatch(initCardStart(card));
};

export const deselectCard = (card: Card) => async (dispatch: AppDispatch): Promise<void> => {
    dispatch(deselectCardStart());
    dispatch(updateCardInList({ ...card }));
};

export const createCard = (payload: CardPayload<'name' | 'color' | 'owner'>) => async (
    dispatch: AppDispatch
): Promise<void> => {
    dispatch(createCardStart());
    try {
        const { data } = await axios.post<Card>('/api/cards', payload, getAuthHeader());
        dispatch(createCardSuccess());
        dispatch(addCardToList(data));
    } catch (err) {
        dispatch(createCardError(getError(err)));
    }
};

export const updateCard = (
    cardId: string,
    ownerId: string,
    payload: Partial<CardPayload<'name' | 'description' | 'color'>>
) => async (dispatch: AppDispatch): Promise<void> => {
    dispatch(updateCardStart({ _id: cardId, ...payload }));
    dispatch(updateCardInList({ owner: ownerId, _id: cardId, ...payload }));
    try {
        await axios.patch<Card>(
            '/api/cards/' + cardId,
            { owner: ownerId, ...payload },
            getAuthHeader()
        );
        dispatch(updateCardSuccess());
    } catch (err) {
        dispatch(updateCardError(getError(err)));
    }
};

export const updateCardChecklistOrder = (
    cardId: string,
    srcIdx: number,
    desIdx: number,
    order: string[]
) => async (dispatch: AppDispatch): Promise<void> => {
    dispatch(updateCardChecklistOrderStart({ checklistOrder: order }));
    try {
        await axios.patch<Card>(
            `/api/cards/${cardId}/update/checklist/order`,
            { srcIdx, desIdx },
            getAuthHeader()
        );
        dispatch(updateCardChecklistOrderSuccess());
    } catch (err) {
        dispatch(updateCardChecklistOrderError(getError(err)));
    }
};

export const deleteCard = (cardId: string, ownerId: string) => async (
    dispatch: AppDispatch
): Promise<void> => {
    dispatch(deleteCardStart());
    dispatch(removeCardFromList({ _id: cardId, owner: ownerId }));
    try {
        await axios.delete<Card>('/api/cards/' + cardId, getAuthHeader());
        dispatch(deleteCardSuccess());
    } catch (err) {
        dispatch(deleteCardError(getError(err)));
    }
};
