import { useContext } from 'react';
import { NavLink, useHistory } from 'react-router-dom';

import Button from '../../../Interactable/Button';
import { AuthContext } from '../../../../context';
import { Functional } from '../../../../util';
import classes from './Links.module.css';

/**
 * Base component for navigational routing links.
 */

const NavLinks: Functional = (props) => {
    const history = useHistory();
    const authContext = useContext(AuthContext);

    const onLogOut = (): void => {
        authContext.logout();
        history.push('/');
    };

    return (
        <ul className={classes.Link}>
            {/*             <li>
                <NavLink activeClassName={classes.Active} to="/" exact>
                    MY BOARDS
                </NavLink>
            </li>
            {authContext.isLoggedIn && (
                <li>
                    <NavLink activeClassName={classes.Active} to={`/${authContext.userId}/places`}>
                        NEW BOARD
                    </NavLink>
                </li>
            )}
            {authContext.isLoggedIn && (
                <li>
                    <NavLink activeClassName={classes.Active} to="/places/new">
                        EDIT PROFILE
                    </NavLink>
                </li>
            )} */}
            {!authContext.isLoggedIn && (
                <li>
                    <NavLink activeClassName={classes.Active} to="/auth">
                        LOGIN/SIGNUP
                    </NavLink>
                </li>
            )}
            {authContext.isLoggedIn && (
                <li>
                    <Button inverse onClick={onLogOut}>
                        LOGOUT
                    </Button>
                </li>
            )}
        </ul>
    );
};

export default NavLinks;
