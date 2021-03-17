import { useReducer, useCallback } from 'react';

import { Action, Identifiable, SIndexable, ValidationValue, Reducer, UseReducerTuple } from '../types';

interface MetaEntry extends SIndexable<ValidationValue | boolean> {
    value: ValidationValue;
    isValid: boolean;
}

interface Entry extends SIndexable<MetaEntry> {}

interface State extends SIndexable<Entry | boolean> {
    inputs: Entry;
    isValid: boolean;
}

interface Payload extends Partial<Identifiable> {
    value?: ValidationValue;
    isValid?: boolean;
    inputs?: Entry;
}

export type InputHandler = (id: string, value: string | number, isValid: boolean) => void;

type SetFormState = (state: State) => void;

enum FormActions {
    INPUT_CHANGE = 'INPUT_CHANGE',
    SET_DATA = 'SET_DATA'
}

const formReducer: Reducer<State, Action<FormActions, Payload>> = (state, action) => {
    const pl: Payload = action.payload;
    switch (action.type) {
        case FormActions.INPUT_CHANGE:
            if (typeof pl.id !== 'undefined' && typeof pl.isValid !== 'undefined' && typeof pl.value !== 'undefined') {
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
                        [pl.id]: { value: pl.value, isValid: pl.isValid }
                    },
                    isValid
                };
            }
            break;
        case FormActions.SET_DATA:
            if (typeof pl.inputs !== 'undefined' && typeof pl.isValid !== 'undefined') {
                return {
                    inputs: pl.inputs,
                    isValid: pl.isValid
                };
            }
            break;
        default:
            break;
    }
    return state;
};

/**
 * A simple and modestly useful hook for handling the input state of a form.
 */

const useForm = (initialState: State): [State, InputHandler, SetFormState] => {
    const [state, dispatch]: UseReducerTuple<State, FormActions, Payload> = useReducer(formReducer, {
        ...initialState
    });

    const inputHandler: InputHandler = useCallback((id: string, value: string | number, isValid: boolean): void => {
        dispatch({ type: FormActions.INPUT_CHANGE, payload: { value, isValid, id } });
    }, []);

    const setFormState: SetFormState = useCallback((state: State): void => {
        dispatch({ type: FormActions.SET_DATA, payload: { ...state } });
    }, []);

    return [state, inputHandler, setFormState];
};

export default useForm;
