import { useReducer, useCallback, Reducer } from 'react';

import { Validator, ValidationType, CustomValidationRule, getValidator, validate } from './form.validation';

enum FormAction {
    INPUT_CHANGE = 'INPUT_CHANGE',
    INPUT_TOUCH = 'INPUT_TOUCH',
    SET_FORM = 'SET_FORM'
}

type FormElementConstraint = HTMLInputElement | HTMLTextAreaElement;

export type FormStateConstraint = { [key: string]: FormValueType };

type ReducerAction = { type: FormAction; payload: Payload };

type GetInputOptions<T extends FormValueType, S extends FormStateConstraint = any> = {
    [key: string]: T | number | boolean | CustomValidationRule<T, S> | undefined;
    minLength?: number;
    maxLength?: number;
    minValue?: number;
    maxValue?: number;
    minUppercaseCharacters?: number;
    minNumericalSymbols?: number;
    isRequired?: boolean;
    isValid?: boolean;
    isTouched?: boolean;
    customRule?: CustomValidationRule<T, S>;
};

export type FormValueType = string | number | boolean;

export type FormEntryState<T extends FormValueType> = {
    value: T;
    isValid: boolean;
    isTouched: boolean;
    validators: Validator[];
};

export type FormState<T extends FormStateConstraint> = {
    inputs: { [K in keyof T]: FormEntryState<T[K]> };
    isValid: boolean;
};

export interface Payload extends Pick<FormEntryState<any>, 'value'> {
    id: string;
    state?: FormState<any>;
}

export function getInput<T extends FormValueType, S extends FormStateConstraint>(
    value: T,
    options?: GetInputOptions<T, S>
): FormEntryState<T> {
    const parsedOptions: { isValid: boolean; isTouched: boolean; validators: Validator[] } = {
        isValid: false,
        isTouched: false,
        validators: []
    };
    if (typeof options !== 'undefined') {
        const keys = Object.keys(options);
        parsedOptions.isTouched = !!options.isTouched;
        parsedOptions.isValid = !!options.isValid;
        keys.forEach((key) => {
            if (!(key in ['isValid', 'isTouched'])) {
                parsedOptions.validators.push(getValidator(key as ValidationType, options[key] as T));
            }
        });
    }
    return {
        ...parsedOptions,
        value
    };
}

function formReducer<S extends FormState<any>>(state: S, action: ReducerAction): S {
    const pl = action.payload;
    switch (action.type) {
        case FormAction.INPUT_CHANGE:
            const plValid = validate(pl.value, state.inputs[pl.id].validators, state);
            let isValid: boolean = true;
            for (const key in state.inputs) {
                if (key === pl.id) {
                    isValid = isValid && plValid;
                } else {
                    isValid = isValid && state.inputs[key].isValid;
                }
            }
            return {
                ...state,
                inputs: {
                    ...state.inputs,
                    [pl.id]: {
                        ...state.inputs[pl.id],
                        value: pl.value,
                        isValid: plValid
                    }
                },
                isValid
            };
        case FormAction.INPUT_TOUCH:
            return {
                ...state,
                inputs: {
                    ...state.inputs,
                    [pl.id]: {
                        ...state.inputs[pl.id],
                        isTouched: true
                    }
                }
            };
        case FormAction.SET_FORM:
            if (typeof pl.state !== 'undefined') {
                return { ...(pl.state as S) };
            } else {
                return state;
            }
        default:
            return state;
    }
}

function useFormState<S extends FormStateConstraint, E extends FormElementConstraint>(
    initialState: FormState<S>
): {
    formState: FormState<S>;
    onTouchHandler: React.FocusEventHandler<E>;
    onChangeHandler: React.ChangeEventHandler<E>;
    setFormState: (state: FormState<S>) => void;
} {
    const [formState, dispatch] = useReducer<Reducer<FormState<S>, ReducerAction>>(formReducer, {
        ...initialState
    });

    const setFormState = useCallback((state: FormState<S>): void => {
        dispatch({ type: FormAction.SET_FORM, payload: { state, value: '', id: '' } });
    }, []);

    const onTouchHandler: React.FocusEventHandler<E> = useCallback((event) => {
        dispatch({ type: FormAction.INPUT_TOUCH, payload: { id: event.target.id, value: '' } });
    }, []);

    const onChangeHandler: React.ChangeEventHandler<E> = useCallback((event) => {
        dispatch({
            type: FormAction.INPUT_CHANGE,
            payload: {
                id: event.target.id,
                value: event.target.value
            }
        });
    }, []);

    return { formState, onChangeHandler, onTouchHandler, setFormState };
}

export default useFormState;
