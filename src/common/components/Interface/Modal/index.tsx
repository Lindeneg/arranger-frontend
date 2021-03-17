import { ReactNode, Fragment, useRef } from 'react';
import { createPortal } from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import Backdrop from '../Backdrop';
import { BaseProps, OptCls, Portal, OnSubmitFunc, Visibility, OnClickFunc, HTMLHooks } from '../../../util';
import classes from './Modal.module.css';

interface ModalProps extends BaseProps, OptCls, Visibility {
    onClose: OnClickFunc;
    headerCls?: string;
    headerText?: string;
    contentCls?: string;
    footerCls?: string;
    footerNodes?: ReactNode;
    onSubmit?: OnSubmitFunc;
}

/**
 * Modal for overlaying the current view with customizable contents.
 */

const Modal: Portal<ModalProps> = (props) => {
    const target: HTMLElement | null = document.getElementById(HTMLHooks.Modal);
    const nodeRef = useRef<HTMLDivElement>(null);
    if (target !== null) {
        const jsx: JSX.Element = (
            <Fragment>
                {props.show && <Backdrop onClick={props.onClose} />}
                <CSSTransition
                    in={props.show}
                    mountOnEnter
                    unmountOnExit
                    timeout={200}
                    classNames={{
                        enter: classes.Enter,
                        enterActive: classes.EnterActive,
                        exit: classes.Exit,
                        exitActive: classes.ExitActive
                    }}
                    nodeRef={nodeRef}
                >
                    <div ref={nodeRef} className={[classes.Modal, props.className].join(' ')} style={props.style}>
                        <header className={[classes.Header, props.headerCls].join(' ')}>
                            <h2>{props.headerText}</h2>
                        </header>
                        <form onSubmit={props.onSubmit ? props.onSubmit : (event) => event.preventDefault()}>
                            <div className={[classes.Content, props.contentCls].join(' ')}>{props.children}</div>
                            <footer className={[classes.Footer, props.footerCls].join(' ')}>{props.footerNodes}</footer>
                        </form>
                    </div>
                </CSSTransition>
            </Fragment>
        );
        return createPortal(jsx, target);
    }
    return null;
};

export default Modal;
