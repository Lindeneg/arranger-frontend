import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import Modal from 'react-bootstrap/Modal';

import { RootState } from '../../../store';
import { negateTheme } from '../../func';
import classes from './Modal.module.css';

export interface ModalProps {
    show: boolean;
    onClose: () => void;
    headerTxt: string;
    body?: JSX.Element;
    footer?: JSX.Element;
    notCenter?: boolean;
}

export const CModal: FC<ModalProps> = (props) => {
    const { theme } = useSelector((state: RootState) => state.user);
    return (
        <Modal
            show={props.show}
            onHide={props.onClose}
            size="lg"
            contentClassName={'bg-' + theme + ' text-' + negateTheme(theme)}
            aria-labelledby="contained-modal-title-vcenter"
            centered={!props.notCenter}
        >
            <Modal.Header
                className={theme === 'dark' ? classes.dark : classes.light}
                closeLabel="close"
                closeButton
            >
                <Modal.Title id="contained-modal-title-vcenter">{props.headerTxt}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{props.body}</Modal.Body>
            <Modal.Footer>{props.footer}</Modal.Footer>
        </Modal>
    );
};

export default CModal;
