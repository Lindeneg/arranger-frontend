import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import { RootState } from '../../../store';
import { negateTheme } from '../../func';
import classes from './ErrorModal.module.css';

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
            onHide={props.onClose}
            size="lg"
            contentClassName={'bg-' + theme + ' text-' + negateTheme(theme)}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header
                className={theme === 'dark' ? classes.dark : classes.light}
                closeLabel="close"
                closeButton
            >
                <Modal.Title id="contained-modal-title-vcenter">
                    {props.headerTxt || 'An Error Occurred'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{props.errorMessage || 'An unknown error has occurred.'}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onClose} variant={negateTheme(theme)}>
                    Okay
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ErrorModal;
