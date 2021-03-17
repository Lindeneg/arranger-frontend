import { Link } from 'react-router-dom';

import { BaseProps, OnClickFunc, Functional } from '../../../util';
import classes from './Button.module.css';

interface ButtonProps extends BaseProps {
    anchor?: { href: string };
    link?: { to: string };
    type?: 'button' | 'submit' | 'reset';
    size?: 'small' | 'big';
    onClick?: OnClickFunc;
    disabled?: boolean;
    inverse?: boolean;
    danger?: boolean;
}

/**
 * Custom interactive button component.
 */

const Button: Functional<ButtonProps> = (props) => {
    const cls: string = [
        classes.Default,
        props.size === 'big' ? classes.Big : props.size === 'small' ? classes.Small : '',
        props.inverse && classes.Inverse,
        props.danger && classes.Danger
    ].join(' ');
    if (props.anchor) {
        return (
            <a href={props.anchor.href} className={cls}>
                {props.children}
            </a>
        );
    } else if (props.link) {
        return (
            <Link to={props.link.to} className={cls}>
                {props.children}
            </Link>
        );
    } else {
        return (
            <button
                type={props.type}
                onClick={props.onClick}
                disabled={props.disabled}
                className={cls}
                style={props.style}
            >
                {props.children}
            </button>
        );
    }
};

export default Button;
