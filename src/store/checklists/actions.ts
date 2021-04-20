import { createAction } from '@reduxjs/toolkit';
import axios from '../../axios-base';

import { AppDispatch } from '..';
import { Checklist, ChecklistPayload } from './types';
import {
    addChecklistToCard,
    updateChecklistInCard,
    removeChecklistFromCard
} from '../cards/actions';
import { getError, getAuthHeader, ResponseError } from '../../common';

export const createChecklistStart = createAction('CREATE_CHECKLIST_START');
export const createChecklistSuccess = createAction('CREATE_CHECKLIST_SUCCESS');
export const createChecklistError = createAction<ResponseError>('CREATE_CHECKLIST_ERROR');

export const updateChecklistStart = createAction('UPDATE_CHECKLIST_START');
export const updateChecklistSuccess = createAction('UPDATE_CHECKLIST_SUCCESS');
export const updateChecklistError = createAction<ResponseError>('UPDATE_CHECKLIST_ERROR');

export const deleteChecklistStart = createAction('DELETE_CHECKLIST_START');
export const deleteChecklistSuccess = createAction('DELETE_CHECKLIST_SUCCESS');
export const deleteChecklistError = createAction<ResponseError>('DELETE_CHECKLIST_ERROR');

export const clearAnyChecklistError = createAction('CLEAR_ANY_CHECKLIST_ERROR');

export const createChecklist = (payload: ChecklistPayload<'objective'>) => async (
    dispatch: AppDispatch
): Promise<void> => {
    dispatch(createChecklistStart());
    try {
        const { data } = await axios.post<Checklist>('/api/checklists', payload, getAuthHeader());
        dispatch(createChecklistSuccess());
        dispatch(addChecklistToCard(data));
    } catch (err) {
        dispatch(createChecklistError(getError(err)));
    }
};

export const updateChecklist = (
    checklistId: string,
    payload: Partial<ChecklistPayload<'objective' | 'isCompleted'>>
) => async (dispatch: AppDispatch): Promise<void> => {
    dispatch(updateChecklistStart());
    dispatch(updateChecklistInCard({ _id: checklistId, ...payload }));
    try {
        await axios.patch<Checklist>('/api/checklists/' + checklistId, payload, getAuthHeader());
        dispatch(updateChecklistSuccess());
    } catch (err) {
        dispatch(updateChecklistError(getError(err)));
    }
};

export const deleteChecklist = (checklistId: string) => async (
    dispatch: AppDispatch
): Promise<void> => {
    dispatch(deleteChecklistStart());
    dispatch(removeChecklistFromCard({ _id: checklistId }));
    try {
        await axios.delete<Checklist>('/api/checklists/' + checklistId, getAuthHeader());
        dispatch(deleteChecklistSuccess());
    } catch (err) {
        dispatch(deleteChecklistError(getError(err)));
    }
};
