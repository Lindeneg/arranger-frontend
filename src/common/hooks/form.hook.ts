import { useReducer, useCallback, Reducer } from 'react';

import { Validator } from './form.validation';

enum FormAction {
    INPUT_CHANGE = 'INPUT_CHANGE'
}

type FormStateConstraint = { [key: string]: FormValueType };

type ReducerAction = { type: FormAction; payload: Payload };

export type FormValueType = string | number | boolean;

export type FormEntryState<T extends FormValueType> = { value: T; isValid: boolean; validators: Validator[] };

export type FormState<T extends FormStateConstraint> = {
    inputs: { [K in keyof T]: FormEntryState<T[K]> };
    isValid: boolean;
};

export interface Payload extends Pick<FormEntryState<any>, 'value' | 'isValid'> {
    id: string;
}

function formReducer<S extends FormState<any>>(state: S, action: ReducerAction) {
    const pl = action.payload;
    switch (action.type) {
        case FormAction.INPUT_CHANGE:
            let isValid: boolean = true;
            for (const key in state.inputs) {
                if (key === pl.id) {
                    isValid = isValid && pl.isValid;
                } else {
                    isValid = isValid && state.inputs[key].isValid;
                }
            }
            return {
                ...state,
                inputs: {
                    ...state.inputs,
                    [pl.id]: {
                        value: pl.value,
                        isValid: pl.isValid
                    }
                },
                isValid
            };
        default:
            return state;
    }
}

function useFormState<S extends FormStateConstraint>(initialState: FormState<S>) {
    const [state, dispatch] = useReducer<Reducer<FormState<S>, ReducerAction>>(formReducer, {
        ...initialState
    });

    const onStateChange = useCallback((id: string, value: FormValueType, isValid: boolean): void => {
        dispatch({ type: FormAction.INPUT_CHANGE, payload: { value, isValid, id } });
    }, []);

    return [state, onStateChange];
}

export default useFormState;
