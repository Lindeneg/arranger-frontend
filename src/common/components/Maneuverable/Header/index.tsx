import { Functional } from '../../../util';
import classes from './Header.module.css';

/**
 * Base header component.
 */

const Header: Functional = (props) => <header className={classes.Header}>{props.children}</header>;

export default Header;
