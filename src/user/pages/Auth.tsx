import { FC, Fragment, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import useForm, { getInput } from 'use-form-state';

import { RootState } from '../../store';
import { loginUser, clearUserError } from '../../store/actions';
import { Spinner, ErrorModal } from '../../common/components';
import { getCls, negateTheme, themeToHex } from '../../common/func';

type AuthFormState = {
    username: string;
    password: string;
    passwordConfirmation?: string;
};

const Auth: FC = () => {
    const dispatch = useDispatch();
    const [isInLoginMode, setLoginMode] = useState<boolean>(true);
    const { theme, requesting, error } = useSelector((state: RootState) => state.user);

    const { formState, onChangeHandler, onTouchHandler, setFormState } = useForm<AuthFormState>({
        inputs: {
            username: getInput('', { minLength: 5, maxLength: 12, maxNumericalSymbols: 0 }),
            password: getInput('', {
                minLength: 8,
                maxLength: 20,
                minNumericalSymbols: 1,
                minUppercaseCharacters: 1,
                connectFields: ['passwordConfirmation']
            })
        },
        isValid: false
    });

    const onSwitchModeHandler = () => {
        const newFormState = { ...formState };
        if (isInLoginMode) {
            setFormState({
                ...newFormState,
                inputs: {
                    ...newFormState.inputs,
                    passwordConfirmation: getInput<string, AuthFormState>('', {
                        customRule: (value, state) =>
                            state.inputs.password.isValid && value === state.inputs.password.value
                    })
                },
                isValid: false
            });
        } else {
            const newFormInputs = { ...newFormState.inputs };
            delete newFormInputs.passwordConfirmation;
            setFormState({
                ...formState,
                inputs: {
                    ...newFormInputs
                },
                isValid: newFormInputs.password.isValid && newFormInputs.username.isValid
            });
        }
        setLoginMode((prev) => !prev);
    };

    const onSubmitHandler: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        console.log(formState);
    };

    const clearError = (): void => {
        dispatch(clearUserError());
    };

    return (
        <Fragment>
            <ErrorModal show={error !== null} onClose={clearError} errorMessage={error} headerTxt="Login Failed" />
            {requesting && <Spinner absoluteCentered />}
            {!requesting && (
                <Container className={getCls('text-' + negateTheme(theme), 'bg-' + theme)}>
                    <h4 className="pt-3">{isInLoginMode ? 'Please Login' : 'Please Signup'}</h4>
                    <hr style={{ borderTop: `1px solid ${themeToHex(negateTheme(theme))}` }} />
                    <Form className="pb-3" onSubmit={onSubmitHandler}>
                        <Form.Group controlId="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                onChange={onChangeHandler}
                                onBlur={onTouchHandler}
                                isInvalid={formState.inputs.username.isTouched && !formState.inputs.username.isValid}
                                isValid={!!formState.inputs.username.isValid}
                                type="text"
                                placeholder="Enter username"
                                aria-describedby="usernameHelpBlock"
                                required
                            />
                            <Form.Control.Feedback type="valid">Looks good.</Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">Please enter a valid username.</Form.Control.Feedback>
                            {!isInLoginMode && (
                                <Form.Text id="usernameHelpBlock" muted>
                                    Your username must be between 5-12 characters.
                                </Form.Text>
                            )}
                        </Form.Group>
                        <Form.Group controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                onChange={onChangeHandler}
                                onBlur={onTouchHandler}
                                isInvalid={formState.inputs.password.isTouched && !formState.inputs.password.isValid}
                                isValid={!!formState.inputs.password.isValid}
                                type="password"
                                placeholder="Password"
                                aria-describedby="passwordHelpBlock"
                                required
                            />
                            <Form.Control.Feedback type="valid">Looks good.</Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">Please enter a valid password.</Form.Control.Feedback>
                            {!isInLoginMode && (
                                <Form.Text id="passwordHelpBlock" muted>
                                    Your password must be 8-20 characters long and contain at least one uppercase letter
                                    and at least one number.
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
    );
};

export default Auth;
