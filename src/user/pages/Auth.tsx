import { FC, Fragment, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { RootState } from '../../store';
import { loginUser, clearUserError } from '../../store/actions';
import { useForm, getInput } from '../../common/hooks';
import { Spinner, ErrorModal } from '../../common/components';
import { getCls, negateTheme, themeToHex } from '../../common/func';
import { FormState } from '../../common/hooks/form.hook';

type AuthFormState = {
    username: string;
    password: string;
    passwordConfirmation?: string;
};

const getDefaultFormState = (): FormState<AuthFormState> => ({
    inputs: {
        username: getInput('', { minLength: 5, maxLength: 12 }),
        password: getInput('', { minLength: 8, maxLength: 20, minNumericalSymbols: 1, minUppercaseCharacters: 1 })
    },
    isValid: false
});

const Auth: FC = () => {
    const dispatch = useDispatch();
    const [isInLoginMode, setLoginMode] = useState<boolean>(true);
    const { theme, requesting, error } = useSelector((state: RootState) => state.user);

    const { formState, onChangeHandler, onTouchHandler, setFormState } = useForm<AuthFormState, HTMLInputElement>(
        getDefaultFormState()
    );

    useEffect(() => {
        console.log(formState);
    });

    const onSwitchModeHandler = () => {
        setLoginMode((prev) => !prev);
    };

    const onSubmitHandler: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
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
                                isInvalid={!formState.inputs.username.isValid}
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
                                type="password"
                                placeholder="Password"
                                aria-describedby="passwordHelpBlock"
                                required
                            />
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
                                    type="password"
                                    placeholder="Password"
                                    required
                                    aria-describedby="confirmPasswordHelpBlock"
                                />
                                <Form.Text id="confirmPasswordHelpBlock" muted>
                                    Please confirm your password by entering it again.
                                </Form.Text>
                            </Form.Group>
                        )}
                        <div className="d-flex justify-content-between">
                            <Button variant={negateTheme(theme)} type="submit">
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
