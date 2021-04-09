import { FC } from 'react';
import { useSelector } from 'react-redux';
import Navbar from 'react-bootstrap/Navbar';
import Modal from 'react-bootstrap/Modal';

import { RootState } from '../../../../store';
import { getCls } from '../../../func';
import classes from './SideDrawer.module.css';

export interface SideDrawerProps {
    show: boolean;
    onClose: () => void;
}

export const SideDrawer: FC<SideDrawerProps> = (props) => {
    const { theme } = useSelector((state: RootState) => state.user);
    return (
        <Modal
            dialogClassName={classes.wrapper}
            contentClassName={getCls('bg-' + theme, classes.content)}
            show={props.show}
            onHide={props.onClose}
        >
            <Modal.Header
                closeLabel="close"
                className={theme === 'dark' ? classes.headerDark : classes.headerLight}
                closeButton
            >
                <Modal.Title>Arranger</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Navbar variant={theme} className={'bg-' + theme}>
                    {props.children}
                </Navbar>
            </Modal.Body>
        </Modal>
    );
};

export default SideDrawer;
