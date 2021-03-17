import { useReducer, useEffect } from 'react';

import inputReducer from './reducer';
import InputAction from './actions';
import {
    BaseProps,
    Functional,
    Identifiable,
    OnBlur,
    OnChange,
    UseReducerTuple,
    ValidationValue,
    Validator
} from '../../../../common/util';
import classes from './Input.module.css';

interface InputProps extends BaseProps, Partial<Identifiable> {
    onInput: (...args: any[]) => void;
    element: 'input' | 'text-area';
    type?: 'text' | 'number' | 'email' | 'password';
    value?: string | number;
    label?: string;
    errorText?: string;
    placeHolder?: string;
    rows?: number;
    valid?: boolean;
    validators?: Validator[];
}

export interface InputState {
    value: ValidationValue;
    isValid: boolean;
    isTouched: boolean;
}

export type InputPayload = Partial<InputState>;

/**
 * Custom interactive Input/Form component.
 */

const Input: Functional<InputProps> = (props) => {
    const [state, dispatch]: UseReducerTuple<InputState, InputAction, InputPayload> = useReducer(inputReducer, {
        value: props.value || '',
        isValid: props.valid || false,
        isTouched: false
    });

    const onChangeHandler: OnChange<HTMLInputElement | HTMLTextAreaElement> = (event) => {
        dispatch({
            type: InputAction.CHANGE,
            payload: {
                value: event.target.value
            },
            validators: props.validators
        });
    };

    const onTouchHandler: OnBlur<HTMLInputElement | HTMLTextAreaElement> = (event) => {
        dispatch({ type: InputAction.TOUCH, payload: {} });
    };

    const { id, onInput } = props;
    const { value, isValid } = state;

    useEffect(() => {
        onInput(id, value, isValid);
    }, [id, onInput, value, isValid]);

    let element: JSX.Element;
    switch (props.element) {
        case 'input':
            element = (
                <input
                    id={props.id}
                    type={props.type || 'text'}
                    placeholder={props.placeHolder}
                    onChange={onChangeHandler}
                    onBlur={onTouchHandler}
                    value={state.value?.toString()}
                />
            );
            break;
        case 'text-area':
            element = (
                <textarea
                    id={props.id}
                    rows={props.rows || 3}
                    onChange={onChangeHandler}
                    onBlur={onTouchHandler}
                    value={state.value?.toString()}
                />
            );
            break;
        default:
            element = <input />;
            break;
    }

    return (
        <div
            className={[
                classes.Control,
                !state.isValid && state.isTouched && classes.Invalid,
                state.isValid && state.isTouched && classes.Valid
            ].join(' ')}
        >
            <label htmlFor={props.id}>{props.label}</label>
            {element}
            {!state.isValid && state.isTouched && <p>{props.errorText}</p>}
        </div>
    );
};

export default Input;
