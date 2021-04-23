import React, { FC, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Intro from '../components/Intro';
import UserForm from '../components/UserForm';
import { RootState } from '../../store';
import { loginUser, createUser, clearUserError } from '../../store/actions';
import { Spinner, ErrorModal } from '../../common/components';

const UserAuth: FC = () => {
    const dispatch = useDispatch();
    const { theme, token, requesting, error } = useSelector((state: RootState) => state.user);

    const onSubmitHandler = (username: string, password: string, login: boolean): void => {
        const action = login ? loginUser : createUser;
        dispatch(action({ username, password }));
    };

    const clearError = (): void => {
        dispatch(clearUserError());
    };

    return (
        <Fragment>
            <ErrorModal
                show={error !== null}
                onClose={clearError}
                errorMessage={error}
                headerTxt="Login Failed"
            />
            {requesting && <Spinner absoluteCentered />}
            {!requesting && (
                <Fragment>
                    <Intro theme={theme} />
                    {!token && <UserForm mode="initial" onSubmit={onSubmitHandler} />}
                </Fragment>
            )}
        </Fragment>
    );
};

export default UserAuth;
