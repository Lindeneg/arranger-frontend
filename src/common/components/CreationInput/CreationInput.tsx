import React, { FC, Fragment, CSSProperties, useState } from 'react';
import { useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import { CheckCircle, XCircle } from 'react-bootstrap-icons';

import useForm, { getInput } from 'use-form-state';

import ColorSelection from '../ColorSelection/ColorSelection';
import { RootState } from '../../../store';
import { negateTheme, ColorOption, ThemeOption } from '../../';

interface CreationInputProps {
    type: 'board' | 'list' | 'card' | 'checklist';
    inputMaxLength: number;
    placeholder: string;
    onCreate: (name: string, color: ColorOption) => void;
    onClose?: () => void;
    color?: boolean;
    alwaysShowInput?: boolean;
    customColor?: ThemeOption;
    chosenColor?: ColorOption;
    inputValue?: string;
    style?: CSSProperties;
}

const initialInput = (maxLength: number, value = '') =>
    getInput<string>(value, {
        maxLength,
        minLength: 1,
        isValid: value.length <= maxLength && value.length >= 1
    });
const colorInput = (color: ColorOption) => getInput<ColorOption>(color, { isValid: true });

const CreationInput: FC<CreationInputProps> = (props) => {
    const { theme } = useSelector((state: RootState) => state.user);
    const negatedTheme = negateTheme(theme);
    const customColor = props.customColor ? props.customColor : negatedTheme;
    const [creating, setCreating] = useState<boolean>(false);
    const { formState, onChangeHandler, onTouchHandler, setFormState } = useForm<{
        name: string;
        color: ColorOption;
    }>({
        name: initialInput(props.inputMaxLength, props.inputValue),
        color: colorInput(props.chosenColor || negatedTheme)
    });

    const onCreate = (e: React.MouseEvent): void => {
        e.preventDefault();
        props.onCreate(formState.inputs.name.value, formState.inputs.color.value);
        props.onClose && props.onClose();
    };

    const onCreateAccept = (): void => {
        setCreating(true);
    };

    const onCreateDeny = (): void => {
        setFormState({
            ...formState.inputs,
            name: initialInput(props.inputMaxLength, props.inputValue),
            color: colorInput(props.chosenColor || negatedTheme)
        });
        setCreating(false);
    };

    const onSelectColor = (color: ColorOption): void => {
        setFormState({
            ...formState.inputs,
            color: colorInput(color)
        });
    };

    return (
        <Fragment>
            {(props.alwaysShowInput || creating) && (
                <div style={{ width: '18rem', ...props.style }}>
                    <InputGroup className="mb-2 mt-3">
                        <FormControl
                            id="name"
                            isInvalid={
                                formState.inputs.name.isTouched && !formState.inputs.name.isValid
                            }
                            isValid={formState.inputs.name.isValid}
                            value={formState.inputs.name.value}
                            onChange={onChangeHandler}
                            onBlur={onTouchHandler}
                            placeholder={props.placeholder + '...'}
                        />
                        {props.color === true && (
                            <ColorSelection
                                asElement={InputGroup.Prepend}
                                chosenColor={formState.inputs.color.value}
                                onSelect={onSelectColor}
                            />
                        )}
                        <FormControl.Feedback type="invalid" className={'text-' + negatedTheme}>
                            {props.type[0].toUpperCase() + props.type.substr(1)}s are limited to{' '}
                            {props.inputMaxLength} characters.
                        </FormControl.Feedback>
                    </InputGroup>
                    <CheckCircle
                        onClick={formState.isValid ? onCreate : () => null}
                        role={formState.isValid ? 'button' : 'none'}
                        size="30"
                        className={
                            'mr-1 ' + (formState.isValid ? 'text-' + customColor : 'text-muted')
                        }
                    />
                    <XCircle
                        onClick={props.onClose ? props.onClose : onCreateDeny}
                        role="button"
                        size="30"
                        className={'ml-1 text-' + customColor}
                    />
                </div>
            )}
            {!props.alwaysShowInput && !creating && (
                <Button
                    type="button"
                    variant={customColor}
                    onClick={onCreateAccept}
                    className="mt-3"
                >
                    CREATE {props.type.toUpperCase()}
                </Button>
            )}
        </Fragment>
    );
};

export default CreationInput;
