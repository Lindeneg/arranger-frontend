import React, { FC, Fragment, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Alert from 'react-bootstrap/Alert';

import UserForm from '../components/UserForm';
import { RootState } from '../../store';
import { deleteUser, updateUser, clearUserError } from '../../store/actions';
import { ConfirmModal, ErrorModal, Spinner } from '../..//common/components';

export const UserProfile: FC = () => {
    const dispatch = useDispatch();
    const { requesting, requested, error } = useSelector((state: RootState) => state.user);
    const [updated, setUpdated] = useState<'Username' | 'Password' | null>(null);
    const [deleting, setDeleting] = useState<boolean>(false);

    const onUpdate = (username: string, password: string, updateUsername: boolean): void => {
        dispatch(updateUser(updateUsername ? { username } : { password }));
        setUpdated(updateUsername ? 'Username' : 'Password');
    };

    const onDelete = (): void => {
        dispatch(deleteUser());
    };

    const clearError = (): void => {
        dispatch(clearUserError());
        setUpdated(null);
    };

    return (
        <Fragment>
            {requested && !error && updated && (
                <Alert dismissible variant="primary" onClose={() => setUpdated(null)}>
                    Succesfully Updated {updated}
                </Alert>
            )}
            <ErrorModal show={!!error} errorMessage={error} onClose={clearError} />
            <ConfirmModal
                show={deleting}
                headerTxt="Are you sure?"
                onClose={() => setDeleting(false)}
                onConfirm={onDelete}
            />
            {requesting ? (
                <Spinner absoluteCentered />
            ) : (
                <UserForm
                    mode="update"
                    onSubmit={onUpdate}
                    onDelete={() => setDeleting(true)}
                    alwaysShowUserHelp
                />
            )}
        </Fragment>
    );
};

export default UserProfile;
