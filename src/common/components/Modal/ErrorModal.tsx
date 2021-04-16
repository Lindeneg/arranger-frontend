import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';

import Modal from '../Modal/Modal';
import { RootState } from '../../../store';
import { negateTheme } from '../../func';

export interface ErrorModalProps {
    show: boolean;
    onClose: () => void;
    errorMessage: string | null;
    headerTxt?: string;
}

export const ErrorModal: FC<ErrorModalProps> = (props) => {
    const { theme } = useSelector((state: RootState) => state.user);
    return (
        <Modal
            show={props.show}
            onClose={props.onClose}
            headerTxt={props.headerTxt || 'An Error Occurred'}
            body={<p>{props.errorMessage || 'An unknown error has occurred.'}</p>}
            footer={
                <Button onClick={props.onClose} variant={negateTheme(theme)}>
                    Okay
                </Button>
            }
        />
    );
};

export default ErrorModal;
