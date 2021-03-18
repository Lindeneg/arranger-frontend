import { useReducer, useEffect, CSSProperties } from 'react';

import inputReducer from './reducer';
import InputAction from './actions';
import {
    BaseProps,
    colorName,
    Functional,
    Identifiable,
    OnBlur,
    OnChange,
    OnClickFunc,
    UseReducerTuple,
    ValidationValue,
    Validator
} from '../../../../common/util';
import classes from './Input.module.css';

interface InputProps extends BaseProps, Partial<Identifiable> {
    onInput: (...args: any[]) => void;
    element: 'input' | 'text-area' | 'select';
    type?: 'text' | 'number' | 'email' | 'password';
    value?: string | number;
    label?: string;
    errorText?: string;
    placeHolder?: string;
    rows?: number;
    valid?: boolean;
    validators?: Validator[];
    selectOptions?: { bg: string; value: string; c?: string }[];
    selectStyle?: CSSProperties;
    onClick?: OnClickFunc;
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

    const onChangeHandler: OnChange<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> = (event) => {
        dispatch({
            type: InputAction.CHANGE,
            payload: {
                value: event.target.value
            },
            validators: props.validators
        });
    };

    const onTouchHandler: OnBlur<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> = (event) => {
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
        case 'select':
            element = (
                <select
                    style={props.selectStyle}
                    onChange={onChangeHandler}
                    id={props.id}
                    value={state.value?.toString()}
                    onClick={props.onClick}
                    className={classes.Selector}
                >
                    {(props.selectOptions ? props.selectOptions : []).map((option, index) => (
                        <option
                            key={index}
                            style={{ backgroundColor: option.bg, color: option.c }}
                            value={option.value}
                            className={classes.Option}
                        >
                            {colorName[option.value]}
                        </option>
                    ))}
                </select>
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
                !state.isValid && state.isTouched ? classes.Invalid : null,
                state.isValid && state.isTouched ? classes.Valid : null
            ].join(' ')}
        >
            <label htmlFor={props.id}>{props.label}</label>
            {element}
            {!state.isValid && state.isTouched && <p>{props.errorText}</p>}
        </div>
    );
};

export default Input;
