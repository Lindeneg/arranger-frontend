import React, { FC, Fragment, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import useForm, { getInput } from 'use-form-state';

import Intro from '../components/Intro';
import { RootState } from '../../store';
import { loginUser, createUser, clearUserError } from '../../store/actions';
import { getCls, negateTheme, themeToHex } from '../../common';
import { Spinner, ErrorModal } from '../../common/components';

type AuthFormState = {
    username: string;
    password: string;
    passwordConfirmation?: string;
};

const Auth: FC = () => {
    const dispatch = useDispatch();
    const [isInLoginMode, setLoginMode] = useState<boolean>(true);
    const { theme, token, requesting, error } = useSelector((state: RootState) => state.user);

    const { formState, onChangeHandler, onTouchHandler, setFormState } = useForm<AuthFormState>({
        username: getInput('', { minLength: 4, maxLength: 16, maxNumericalSymbols: 0 }),
        password: getInput('', {
            minLength: 8,
            maxLength: 32,
            minNumericalSymbols: 1,
            minUppercaseCharacters: 1,
            connectFields: ['passwordConfirmation']
        })
    });

    const onSwitchModeHandler = () => {
        const newFormState = { ...formState };
        if (isInLoginMode) {
            setFormState({
                ...newFormState.inputs,
                passwordConfirmation: getInput<string, AuthFormState>('', {
                    customRule: (value, state) => state.inputs.password.isValid && value === state.inputs.password.value
                })
            });
        } else {
            setFormState({
                password: { ...newFormState.inputs.password },
                username: { ...newFormState.inputs.username }
            });
        }
        setLoginMode((prev) => !prev);
    };

    const onSubmitHandler: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        const action = isInLoginMode ? loginUser : createUser;
        dispatch(
            action({
                username: formState.inputs.username.value,
                password: formState.inputs.password.value
            })
        );
    };

    const clearError = (): void => {
        dispatch(clearUserError());
    };

    return (
        <Fragment>
            <ErrorModal show={error !== null} onClose={clearError} errorMessage={error} headerTxt="Login Failed" />
            {requesting && <Spinner absoluteCentered />}
            {!requesting && (
                <Fragment>
                    <Intro theme={theme} />
                    {!token && (
                        <Container className={getCls('text-' + negateTheme(theme), 'bg-' + theme, 'mt-5')}>
                            <h4 className="pt-3">{isInLoginMode ? 'Please Login' : 'Please Signup'}</h4>
                            <hr style={{ borderTop: `1px solid ${themeToHex(negateTheme(theme))}` }} />
                            <Form className="pb-3" onSubmit={onSubmitHandler}>
                                <Form.Group controlId="username">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        onChange={onChangeHandler}
                                        onBlur={onTouchHandler}
                                        isInvalid={
                                            !!formState.inputs.username.isTouched && !formState.inputs.username.isValid
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
                                    {!isInLoginMode && (
                                        <Form.Text id="usernameHelpBlock" muted>
                                            Your username must be between 4-16 characters and contain no numbers.
                                        </Form.Text>
                                    )}
                                </Form.Group>
                                <Form.Group controlId="password">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        onChange={onChangeHandler}
                                        onBlur={onTouchHandler}
                                        isInvalid={
                                            !!formState.inputs.password.isTouched && !formState.inputs.password.isValid
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
                                    <Button disabled={!formState.isValid} variant={negateTheme(theme)} type="submit">
                                        {isInLoginMode ? 'LOGIN' : 'SIGNUP'}
                                    </Button>
                                    <Button onClick={onSwitchModeHandler} variant={theme} type="button">
                                        SWITCH TO {isInLoginMode ? 'SIGNUP' : 'LOGIN'}
                                    </Button>
                                </div>
                            </Form>
                        </Container>
                    )}
                </Fragment>
            )}
        </Fragment>
    );
};

export default Auth;
