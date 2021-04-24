import React, { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import useForm, { getInput } from 'cl-use-form-state';

import { RootState } from '../../store';
import { getCls, negateTheme, themeToHex } from '../../common';
import { Hr } from '../../common/components';

type FormMode = 'initial' | 'update';

interface UserFormProps {
    mode: FormMode;
    onSubmit: (username: string, password: string, login: boolean) => void;
    onDelete?: () => void;
    alwaysShowUserHelp?: boolean;
}

type UserFormInputs = {
    username: string;
    password: string;
    passwordConfirmation?: string;
};

const UserForm: FC<UserFormProps> = (props) => {
    const isUpdate = props.mode === 'update';
    const [isInLoginMode, setLoginMode] = useState<boolean>(true);
    const { theme } = useSelector((state: RootState) => state.user);
    const { formState, onChangeHandler, onTouchHandler, setFormState } = useForm<UserFormInputs>({
        username: getInput('', {
            minLength: 4,
            maxLength: 16,
            maxNumericalSymbols: 0
        }),
        password: getInput('', {
            minLength: 8,
            maxLength: 32,
            minNumericalSymbols: 1,
            minUppercaseCharacters: 1,
            connectFields: ['passwordConfirmation'],
            isValid: isUpdate && isInLoginMode
        })
    });
    const negatedTheme = negateTheme(theme);

    const onSwitchModeHandler = () => {
        const newFormState = { ...formState };
        if (isInLoginMode) {
            setFormState({
                ...newFormState.inputs,
                username: {
                    ...newFormState.inputs.username,
                    isValid: isUpdate,
                    isTouched: false,
                    value: ''
                },
                password: {
                    ...newFormState.inputs.password,
                    isValid: false,
                    isTouched: false,
                    value: ''
                },
                passwordConfirmation: getInput<string, UserFormInputs>('', {
                    customRule: (value, state) =>
                        state.inputs.password.isValid && value === state.inputs.password.value
                })
            });
        } else {
            setFormState({
                password: {
                    ...newFormState.inputs.password,
                    isValid: isUpdate,
                    isTouched: false,
                    value: ''
                },
                username: {
                    ...newFormState.inputs.username,
                    isValid: false,
                    isTouched: false,
                    value: ''
                }
            });
        }
        setLoginMode((prev) => !prev);
    };

    const onSubmitHandler: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        props.onSubmit(
            formState.inputs.username.value,
            formState.inputs.password.value,
            isInLoginMode
        );
    };

    return (
        <Container className={getCls('text-' + negatedTheme, 'bg-' + theme, 'mt-5')}>
            <h4 className="pt-3">
                {isUpdate
                    ? 'Update ' + (isInLoginMode ? 'Username' : 'Password')
                    : 'Please ' + isInLoginMode
                    ? 'Login'
                    : 'Signup'}
            </h4>
            <hr style={{ borderTop: `1px solid ${themeToHex(negatedTheme)}` }} />
            <Form className="pb-3" onSubmit={onSubmitHandler}>
                {(!isUpdate || (isUpdate && isInLoginMode)) && (
                    <Form.Group controlId="username">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            onChange={onChangeHandler}
                            onBlur={onTouchHandler}
                            isInvalid={
                                !!formState.inputs.username.isTouched &&
                                !formState.inputs.username.isValid
                            }
                            isValid={!!formState.inputs.username.isValid}
                            value={formState.inputs.username.value}
                            type="text"
                            placeholder="Enter username"
                            aria-describedby="usernameHelpBlock"
                            required
                        />
                        <Form.Control.Feedback type="valid">Looks good.</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">
                            Please enter a valid username.
                        </Form.Control.Feedback>
                        {(!!props.alwaysShowUserHelp || !isInLoginMode) && (
                            <Form.Text id="usernameHelpBlock" muted>
                                Your username must be between 4-16 characters and contain no
                                numbers.
                            </Form.Text>
                        )}
                    </Form.Group>
                )}
                {(!isUpdate || (isUpdate && !isInLoginMode)) && (
                    <Form.Group controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            onChange={onChangeHandler}
                            onBlur={onTouchHandler}
                            isInvalid={
                                !!formState.inputs.password.isTouched &&
                                !formState.inputs.password.isValid
                            }
                            isValid={!!formState.inputs.password.isValid}
                            value={formState.inputs.password.value}
                            type="password"
                            placeholder="Password"
                            aria-describedby="passwordHelpBlock"
                            required
                        />
                        <Form.Control.Feedback type="valid">Looks good.</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">
                            Please enter a valid password.
                        </Form.Control.Feedback>
                        {!isInLoginMode && (
                            <Form.Text id="passwordHelpBlock" muted>
                                Your password must be 8-32 characters long and contain at least one
                                uppercase letter and at least one number.
                            </Form.Text>
                        )}
                    </Form.Group>
                )}
                {!isInLoginMode && (
                    <Form.Group controlId="passwordConfirmation">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            onChange={onChangeHandler}
                            onBlur={onTouchHandler}
                            isInvalid={
                                !!formState.inputs.passwordConfirmation?.isTouched &&
                                !formState.inputs.passwordConfirmation?.isValid
                            }
                            isValid={!!formState.inputs.passwordConfirmation?.isValid}
                            value={formState.inputs.passwordConfirmation?.value}
                            type="password"
                            placeholder="Password"
                            required
                            aria-describedby="confirmPasswordHelpBlock"
                        />
                        <Form.Control.Feedback type="valid">Looks good.</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">
                            Please confirm a valid password.
                        </Form.Control.Feedback>
                        <Form.Text id="confirmPasswordHelpBlock" muted>
                            Please confirm your password by entering it again.
                        </Form.Text>
                    </Form.Group>
                )}
                <div className="d-flex justify-content-between">
                    <Button disabled={!formState.isValid} variant={negatedTheme} type="submit">
                        {isUpdate
                            ? 'UPDATE ' + (isInLoginMode ? 'USERNAME' : 'PASSWORD')
                            : isInLoginMode
                            ? 'LOGIN'
                            : 'SIGNUP'}
                    </Button>
                    <Button onClick={onSwitchModeHandler} variant={theme} type="button">
                        {'SWITCH TO ' +
                            (isUpdate
                                ? isInLoginMode
                                    ? 'PASSWORD'
                                    : 'USERNAME'
                                : isInLoginMode
                                ? 'SIGNUP'
                                : 'LOGIN')}
                    </Button>
                </div>
            </Form>

            {typeof props.onDelete === 'function' && (
                <>
                    <Hr colorText={negatedTheme} />
                    <Button
                        onClick={props.onDelete}
                        variant="danger"
                        type="button"
                        className="mb-4 mt-2 w-100"
                    >
                        DELETE PROFILE
                    </Button>
                </>
            )}
        </Container>
    );
};

export default UserForm;
