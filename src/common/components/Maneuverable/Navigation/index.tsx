import { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';

import NavLinks from './Links';
import SideDrawer from './SideDrawer';
import Header from '../Header';
import Backdrop from '../../Interface/Backdrop';
import { Functional } from '../../../util';
import classes from './Nav.module.css';

/**
 * Main navigational component handing both desktop and mobile.
 */

const Nav: Functional = (props) => {
    const [drawerIsOpen, setDrawerIsOpen] = useState<boolean>(false);

    const handleOnOpenDrawer = () => {
        setDrawerIsOpen(true);
    };

    const handleOnCloseDrawer = () => {
        setDrawerIsOpen(false);
    };

    return (
        <Fragment>
            {drawerIsOpen && <Backdrop onClick={handleOnCloseDrawer} />}
            <SideDrawer show={drawerIsOpen} onClick={handleOnCloseDrawer}>
                <nav className={classes.Drawer}>
                    <NavLinks />
                </nav>
            </SideDrawer>
            <Header>
                <button className={classes.Btn} onClick={handleOnOpenDrawer}>
                    <span />
                    <span />
                    <span />
                </button>
                <h1 className={classes.Title}>
                    <Link to="/">Arranger</Link>
                </h1>
                <nav className={classes.Nav}>
                    <NavLinks />
                </nav>
            </Header>
        </Fragment>
    );
};

export default Nav;
