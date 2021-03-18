import { useState, useContext, Fragment } from 'react';

import { useForm, useHttp } from '../../../common/hooks';
import Input from '../../../common/components/Interactable/Input';
import Button from '../../../common/components/Interactable/Button';
import Card from '../../../common/components//Interface/Card';
import ErrorModal from '../../../common/components/Interface/Modal/ErrorModal';
import Spinner from '../../../common/components/Interface/Spinner';
import { AuthContext } from '../../../common/context';
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
    const authContext = useContext(AuthContext);
    const [isInLoginMode, setLoginMode] = useState<boolean>(true);
    const { isLoading, error, clearError, sendRequest } = useHttp<UserAuthResponse>();

    const [state, inputHandler] = useForm({
        inputs: {
            username: { value: '', isValid: false },
            password: { value: '', isValid: false }
        },
        isValid: false
    });

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
        } catch (err) {
            devLog(err);
        }
    };

    const onToggleModeHandler: OnClickFunc = () => {
        setLoginMode((prevState) => !prevState);
    };

    return (
        <Fragment>
            {error && <ErrorModal onClear={clearError} error={error} show={!!error} />}
            <Card className={classes.Auth} style={{ maxWidth: '40rem' }}>
                {isLoading && <Spinner asOverlay />}
                <h2 className={classes.Header}>{isInLoginMode ? 'PLEASE LOGIN' : 'PLEASE SIGN UP'}</h2>
                <hr />
                <form className="generic__form-wrapper" style={{backgroundColor: 'inherit', color: '#ccc'}} onSubmit={onSubmitHandler}>
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
                        value={state.inputs.username.value}
                        valid={state.inputs.username.isValid}
                    />
                    <Input
                        id="password"
                        label="PASSWORD"
                        element="input"
                        type="password"
                        errorText={`Please enter a valid password (at least ${RULE.PW_MIN_LEN} characters but at most ${RULE.PW_MAX_LEN}).`}
                        onInput={inputHandler}
                        validators={[
                            // TODO require at least a number and a uppercase char
                            getValidator(ValidationType.MinLength, RULE.PW_MIN_LEN),
                            getValidator(ValidationType.MaxLength, RULE.PW_MAX_LEN)
                        ]}
                        value={state.inputs.password.value}
                        valid={state.inputs.password.isValid}
                    />
                    <Button type="submit" disabled={!state.isValid}>
                        {isInLoginMode ? 'LOGIN' : 'SIGNUP'}
                    </Button>
                </form>
                <Button inverse type="button" onClick={onToggleModeHandler}>
                    {isInLoginMode ? 'SWITCH TO SIGNUP' : 'SWITCH TO LOGIN'}
                </Button>
            </Card>
        </Fragment>
    );
};

export default Auth;
