import React, { FC, Fragment, useState } from 'react';
import { useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import { CheckCircle, XCircle } from 'react-bootstrap-icons';

import useForm, { getInput } from 'use-form-state';

import ColorSelection from '../ColorSelection/ColorSelection';
import { RootState } from '../../../store';
import { negateTheme, ColorOption } from '../../';

interface CreationInputProps {
    type: 'board' | 'list' | 'card' | 'checklist';
    inputMaxLength: number;
    color?: boolean;
    placeholder: string;
    onCreate: (name: string, color: ColorOption) => void;
}

const initialInput = (maxLength: number) => getInput<string>('', { maxLength, minLength: 1 });
const colorInput = (color: ColorOption) => getInput<ColorOption>(color, { isValid: true });

const CreationInput: FC<CreationInputProps> = (props) => {
    const { theme } = useSelector((state: RootState) => state.user);
    const negatedTheme = negateTheme(theme);
    const [creating, setCreating] = useState<boolean>(false);
    const { formState, onChangeHandler, onTouchHandler, setFormState } = useForm<{
        name: string;
        color: ColorOption;
    }>({
        name: initialInput(props.inputMaxLength),
        color: colorInput(negatedTheme)
    });

    const onCreate = (e: React.MouseEvent): void => {
        e.preventDefault();
        props.onCreate(formState.inputs.name.value, formState.inputs.color.value);
    };

    const onCreateAccept = (): void => {
        setCreating(true);
    };

    const onCreateDeny = (): void => {
        setFormState({
            ...formState.inputs,
            name: initialInput(props.inputMaxLength),
            color: colorInput(negatedTheme)
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
            {creating && (
                <div style={{ width: '18rem' }}>
                    <InputGroup className="mb-2 mt-3">
                        <FormControl
                            id="name"
                            isInvalid={
                                formState.inputs.name.isTouched && !formState.inputs.name.isValid
                            }
                            isValid={formState.inputs.name.isValid}
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
                            'mr-1 ' + (formState.isValid ? 'text-' + negatedTheme : 'text-muted')
                        }
                    />
                    <XCircle
                        onClick={onCreateDeny}
                        role="button"
                        size="30"
                        className={'ml-1 text-' + negatedTheme}
                    />
                </div>
            )}
            {!creating && (
                <Button
                    type="button"
                    variant={negatedTheme}
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
