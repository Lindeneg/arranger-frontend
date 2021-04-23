import { createReducer, ActionReducerMapBuilder, PayloadAction } from '@reduxjs/toolkit';

import { ChecklistState } from './types';
import { ResponseError } from '../../common/types';
import {
    createChecklistStart,
    createChecklistSuccess,
    createChecklistError,
    updateChecklistStart,
    updateChecklistSuccess,
    updateChecklistError,
    deleteChecklistStart,
    deleteChecklistSuccess,
    deleteChecklistError,
    clearAnyChecklistError
} from './actions';

const initialState: ChecklistState = {
    requested: false,
    requesting: false,
    error: null
};

export default createReducer(initialState, (builder: ActionReducerMapBuilder<ChecklistState>) => {
    builder.addCase(clearAnyChecklistError, (state) => {
        return {
            ...state,
            error: null
        };
    });
    builder.addMatcher(
        (ac) =>
            [
                createChecklistStart.type,
                updateChecklistStart.type,
                deleteChecklistStart.type
            ].includes(ac.type),
        (state) => {
            return {
                ...state,
                requested: false,
                requesting: true,
                error: null
            };
        }
    );
    builder.addMatcher<PayloadAction<ResponseError>>(
        (ac) =>
            [
                createChecklistSuccess.type,
                updateChecklistSuccess.type,
                deleteChecklistSuccess.type
            ].includes(ac.type),
        (state) => {
            return {
                ...state,
                requested: true,
                requesting: false
            };
        }
    );
    builder.addMatcher<PayloadAction<ResponseError>>(
        (ac) =>
            [
                createChecklistError.type,
                updateChecklistError.type,
                deleteChecklistError.type
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
