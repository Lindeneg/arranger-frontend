import { useState, useContext, useEffect, Fragment } from 'react';
import { useHistory } from 'react-router-dom';

import { useForm, useHttp } from '../../../common/hooks';
import Input from '../../../common/components/Interactable/Input';
import Button from '../../../common/components/Interactable/Button';
import Card from '../../../common/components//Interface/Card';
import ErrorModal from '../../../common/components/Interface/Modal/ErrorModal';
import Spinner from '../../../common/components/Interface/Spinner';
import { AuthContext, ThemeContext } from '../../../common/context';
import {
    getURL,
    devLog,
    getValidator,
    Functional,
    OnClickFunc,
    OnSubmitFunc,
    ValidationType,
    UserAuthResponse,
    RULE
} from '../../../common/util';
import classes from './Auth.module.css';

/**
 * Component to handle login and signup.
 */

const Auth: Functional = (props) => {
    const history = useHistory();
    const authContext = useContext(AuthContext);
    const { resetColor } = useContext(ThemeContext);
    const [isInLoginMode, setLoginMode] = useState<boolean>(true);
    const { isLoading, error, clearError, sendRequest } = useHttp<UserAuthResponse>();

    const [state, inputHandler, setFormState] = useForm({
        inputs: {
            username: { value: '', isValid: false },
            password: { value: '', isValid: false }
        },
        isValid: false
    });

    useEffect(() => {
        resetColor();
    }, [resetColor]);

    const onSubmitHandler: OnSubmitFunc = async (event) => {
        event.preventDefault();
        try {
            const res: UserAuthResponse | void = await sendRequest(
                getURL(isInLoginMode ? 'user/login' : 'user/signup'),
                'POST',
                JSON.stringify({
                    username: state.inputs.username.value,
                    password: state.inputs.password.value
                }),
                { 'Content-Type': 'application/json' }
            );
            res && authContext.login(res._id, res.token);
            res && history.push('/boards');
        } catch (err) {
            devLog(err);
        }
    };

    const onToggleModeHandler: OnClickFunc = () => {
        if (!isInLoginMode) {
            setFormState({
                inputs: {
                    username: { ...state.inputs.username },
                    password: { ...state.inputs.password }
                },
                isValid: state.inputs.username.isValid && state.inputs.password.isValid
            });
        } else {
            setFormState({
                inputs: {
                    username: { ...state.inputs.username },
                    password: { ...state.inputs.password },
                    confirmation: { value: '', isValid: false }
                },
                isValid: false
            });
        }
        setLoginMode((prevState) => !prevState);
    };

    return (
        <Fragment>
            <ErrorModal onClear={clearError} error={error} show={!!error} />
            <div className={classes.Intro}>
                <h2>Arranger </h2>
                <p> Kanban-style, list-making application for managing workflows</p>
                <hr />
                <p>
                    This application was mainly inspired by a{' '}
                    <a href="https://billboard.soutendijk.org" target="_blank" rel="noreferrer">
                        project
                    </a>{' '}
                    made by a former colleague and the popular tool{' '}
                    <a href="https://trello.com" target="_blank" rel="noreferrer">
                        Trello
                    </a>
                </p>
                <p>I wanted to give my shot at creating something similar but with a personal twist.</p>
                <p>Arranger allows management of boards, categories, cards and checklists</p>
            </div>
            {!authContext.isLoggedIn && (
                <Card className={classes.Auth} style={{ maxWidth: '40rem' }}>
                    {isLoading && <Spinner asOverlay />}
                    <h2 className={classes.Header}>{isInLoginMode ? 'PLEASE LOGIN' : 'PLEASE SIGN UP'}</h2>
                    <hr />
                    <form
                        className="generic__form-wrapper"
                        style={{ backgroundColor: 'inherit', color: '#ccc' }}
                        onSubmit={onSubmitHandler}
                    >
                        <Input
                            id="username"
                            label="USERNAME"
                            element="input"
                            type="text"
                            errorText={`Please enter a valid username (at least ${RULE.USR_MIN_LEN} characters but at most ${RULE.USR_MAX_LEN}).`}
                            onInput={inputHandler}
                            validators={[
                                getValidator(ValidationType.MinLength, RULE.USR_MIN_LEN),
                                getValidator(ValidationType.MaxLength, RULE.USR_MAX_LEN)
                            ]}
                        />
                        <Input
                            id="password"
                            label="PASSWORD"
                            element="input"
                            type="password"
                            errorText={`Please enter a valid password (at least ${RULE.PW_MIN_LEN} characters but at most ${RULE.PW_MAX_LEN}) with at least one number and uppercase character.`}
                            onInput={inputHandler}
                            validators={[
                                getValidator(ValidationType.MinLength, RULE.PW_MIN_LEN),
                                getValidator(ValidationType.MaxLength, RULE.PW_MAX_LEN),
                                getValidator(ValidationType.MinUppercaseCharacters, 1),
                                getValidator(ValidationType.MinNumericalSymbols, 1)
                            ]}
                        />
                        {!isInLoginMode && (
                            <Input
                                id="confirmation"
                                label="CONFIRM PASSWORD"
                                element="input"
                                type="password"
                                errorText={`Passwords does not match.`}
                                onInput={inputHandler}
                                validators={[
                                    getValidator(ValidationType.MinLength, RULE.PW_MIN_LEN),
                                    getValidator(ValidationType.MaxLength, RULE.PW_MAX_LEN),
                                    getValidator(ValidationType.IsEqual, state.inputs.password.value)
                                ]}
                            />
                        )}
                        <Button type="submit" disabled={!state.isValid}>
                            {isInLoginMode ? 'LOGIN' : 'SIGNUP'}
                        </Button>
                    </form>
                    <Button inverse type="button" onClick={onToggleModeHandler}>
                        {isInLoginMode ? 'SWITCH TO SIGNUP' : 'SWITCH TO LOGIN'}
                    </Button>
                </Card>
            )}
        </Fragment>
    );
};

export default Auth;
