import { useContext } from 'react';

import { ThemeContext } from '../../../context';
import { Functional } from '../../../util';
import classes from './Header.module.css';

/**
 * Base header component.
 */

const Header: Functional = (props) => {
    const { color } = useContext(ThemeContext);
    return (
        <header style={{ background: color }} className={classes.Header}>
            {props.children}
        </header>
    );
};

export default Header;
