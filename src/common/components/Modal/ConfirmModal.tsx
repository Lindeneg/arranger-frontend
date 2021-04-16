import React, { FC } from 'react';
import Button from 'react-bootstrap/Button';

import Modal from '../Modal/Modal';

export interface ConfirmModalProps {
    show: boolean;
    onConfirm: () => void;
    onClose: () => void;
    headerTxt: string;
}

export const ConfirmModal: FC<ConfirmModalProps> = (props) => (
    <Modal
        show={props.show}
        onClose={props.onClose}
        headerTxt={props.headerTxt || 'An Error Occurred'}
        body={
            <p>
                <strong>Action is irreversible.</strong>
            </p>
        }
        footer={
            <div className="w-100 float-left">
                <Button onClick={props.onConfirm} variant="danger" size="lg" className="mr-2">
                    CONFIRM
                </Button>
                <Button onClick={props.onClose} variant="success" size="lg">
                    CANCEL
                </Button>
            </div>
        }
    />
);

export default ConfirmModal;
