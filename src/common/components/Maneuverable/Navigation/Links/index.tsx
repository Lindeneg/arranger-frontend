import { Fragment, useContext } from 'react';
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
            {authContext.isLoggedIn && (
                <Fragment>
                    <li>
                        <NavLink activeClassName={classes.Active} to="/" exact>
                            HOME
                        </NavLink>
                    </li>
                    <li>
                        <NavLink activeClassName={classes.Active} to="/boards" exact>
                            MY BOARDS
                        </NavLink>
                    </li>
                    <li>
                        <NavLink activeClassName={classes.Active} to="/profile" exact>
                            EDIT PROFILE
                        </NavLink>
                    </li>
                    <li>
                        <Button inverse onClick={onLogOut}>LOGOUT</Button>
                    </li>
                </Fragment>
            )}
        </ul>
    );
};

export default NavLinks;
