import { Fragment, useState, useContext, useEffect } from 'react';

import { useForm, useHttp } from '../../../common/hooks';
import { AuthContext, ThemeContext } from '../../../common/context';
import Button from '../../../common/components/Interactable/Button';
import Input from '../../../common/components/Interactable/Input';
import Card from '../../../common/components/Interface/Card';
import ErrorModal from '../../../common/components/Interface/Modal/ErrorModal';
import Spinner from '../../../common/components/Interface/Spinner';
import {
    Functional,
    DeleteResponse as StdRes,
    RULE,
    getValidator,
    ValidationType,
    OnSubmitFunc,
    getURL,
    devLog
} from '../../../common/util';
import classes from './UpdateUser.module.css';

const UpdateUser: Functional = (props) => {
    const { logout, token } = useContext(AuthContext);
    const { resetColor } = useContext(ThemeContext);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [isUpdatingPassword, setIsUpdatingPassword] = useState<boolean>(false);
    const [successfulPasswordUpdate, setSuccessfulPasswordUpdate] = useState<boolean>(false);
    const { isLoading, error, clearError, sendRequest } = useHttp<StdRes>();
    const [state, inputHandler, setFormState] = useForm({
        inputs: {},
        isValid: false
    });

    useEffect(() => {
        resetColor();
    }, [resetColor]);

    const onChangePasswordAccept = () => {
        setFormState({
            inputs: {
                password: { value: '', isValid: false },
                confirmation: { value: '', isValid: false }
            },
            isValid: false
        });
        setSuccessfulPasswordUpdate(false);
        setIsUpdatingPassword(true);
    };

    const onSubmitHandler: OnSubmitFunc = async (event) => {
        event.preventDefault();
        try {
            const res: StdRes | void = await sendRequest(
                getURL('user'),
                'PATCH',
                JSON.stringify({
                    password: state.inputs.password.value
                }),
                { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }
            );
            if (res) {
                setIsUpdatingPassword(false);
                setSuccessfulPasswordUpdate(true);
            }
        } catch (err) {
            devLog(err);
        }
    };

    const onDeleteHandler = async () => {
        console.log('delete profile');
        try {
            const res: StdRes | void = await sendRequest(getURL('user'), 'DELETE', null, {
                Authorization: 'Bearer ' + token
            });
            if (res) {
                logout();
                return null;
            }
        } catch (err) {
            devLog(err);
        }
    };

    return (
        <Fragment>
            <ErrorModal onClear={clearError} error={error} show={!!error} />
            {isLoading && <Spinner asOverlay />}
            {!isLoading && (
                <div className={classes.Container}>
                    {!isUpdatingPassword && (
                        <Card className={classes.Card}>
                            <h2>
                                {isDeleting
                                    ? 'Are You Sure?'
                                    : successfulPasswordUpdate
                                    ? 'Password Updated'
                                    : 'Update Profile'}
                            </h2>
                            <hr />
                            {!isDeleting && !isUpdatingPassword && !successfulPasswordUpdate && (
                                <Fragment>
                                    <Button onClick={onChangePasswordAccept} inverse>
                                        CHANGE PASSWORD
                                    </Button>
                                    <Button onClick={setIsDeleting.bind(null, true)} inverse>
                                        DELETE PROFILE
                                    </Button>
                                </Fragment>
                            )}
                            {isDeleting && !isUpdatingPassword && !successfulPasswordUpdate && (
                                <Fragment>
                                    <Button onClick={onDeleteHandler} inverse>
                                        CONFIRM DELETE
                                    </Button>
                                    <Button onClick={setIsDeleting.bind(null, false)} inverse>
                                        CANCEL DELETE
                                    </Button>
                                </Fragment>
                            )}
                            {successfulPasswordUpdate && (
                                <Button onClick={setSuccessfulPasswordUpdate.bind(null, false)}>Okay</Button>
                            )}
                        </Card>
                    )}
                    {!isDeleting && isUpdatingPassword && (
                        <form className={['generic__form-wrapper', classes.Form].join(' ')} onSubmit={onSubmitHandler}>
                            <Input
                                id="password"
                                label="New Password"
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
                            <Input
                                id="confirmation"
                                label="Confirm Password"
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
                            <hr />
                            <Button type="submit" disabled={!state.isValid}>
                                CHANGE PASSWORD
                            </Button>
                            <Button onClick={setIsUpdatingPassword.bind(null, false)} type="button">
                                CANCEL
                            </Button>
                        </form>
                    )}
                </div>
            )}
        </Fragment>
    );
};

export default UpdateUser;
