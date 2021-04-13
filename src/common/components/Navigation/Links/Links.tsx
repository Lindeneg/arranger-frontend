import React, { FC, Fragment, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useHistory } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import { HouseDoor, Kanban, Person, DoorOpen, DoorClosed, Toggle2On, Toggle2Off } from 'react-bootstrap-icons';

import { RootState } from '../../../../store';
import { logoutUser } from '../../../../store/actions';
import { getCls, negateTheme, themeToHex } from '../../../func';
import classes from './Links.module.css';

enum NavIcon {
    Home,
    Boards,
    Profile
}

enum LogoutIcon {
    Open,
    Closed
}

const pathnameToNavIcon = (pathname: string): NavIcon => {
    if (pathname === '/boards') {
        return NavIcon.Boards;
    } else if (pathname === '/profile') {
        return NavIcon.Profile;
    } else {
        return NavIcon.Home;
    }
};

export interface LinksProps {
    onClick?: () => void;
    desktop?: boolean;
}

export const Links: FC<LinksProps> = (props) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { token, theme } = useSelector((state: RootState) => state.user);
    const [negatedHexTheme, setNegatedHexTheme] = useState<string>(themeToHex(negateTheme(theme)));
    const [activeNavIcon, setActiveNavIcon] = useState<NavIcon | null>(null);
    const [logoutIcon, setLogoutIcon] = useState<LogoutIcon>(LogoutIcon.Open);

    useEffect(() => {
        setNegatedHexTheme(themeToHex(negateTheme(theme)));
    }, [theme]);

    useEffect(() => {
        const icon = pathnameToNavIcon(history.location.pathname);
        if (icon !== activeNavIcon) {
            setActiveNavIcon(icon);
        }
    }, [activeNavIcon, history.location.pathname]);

    const onLogout = (): void => {
        dispatch(logoutUser());
        history.push('/');
        props.onClick && props.onClick();
    };

    const onSwitchThemeHandler = (): void => {
        console.log('switch theme');
        props.onClick && props.onClick();
    };

    const onNavIconClick = (navIcon: NavIcon): void => {
        setActiveNavIcon(navIcon);
        props.onClick && props.onClick();
    };

    const onLogoutHoverEnterHandler = (): void => {
        setLogoutIcon(LogoutIcon.Closed);
    };

    const onLogoutHoverLeaveHandler = (): void => {
        setLogoutIcon(LogoutIcon.Open);
    };

    return (
        <Nav className={getCls(props.desktop ? 'd-none d-md-flex ' + classes.desktop : classes.mobile)}>
            {!!token && (
                <Fragment>
                    <Nav.Link onClick={onNavIconClick.bind(null, NavIcon.Home)} as={NavLink} to="/" exact>
                        <HouseDoor
                            size="40"
                            color={activeNavIcon === NavIcon.Home ? negatedHexTheme : 'currentColor'}
                        />
                    </Nav.Link>
                    <Nav.Link onClick={onNavIconClick.bind(null, NavIcon.Boards)} as={NavLink} to="/boards" exact>
                        <Kanban size="40" color={activeNavIcon === NavIcon.Boards ? negatedHexTheme : 'currentColor'} />
                    </Nav.Link>
                    <Nav.Link onClick={onNavIconClick.bind(null, NavIcon.Profile)} as={NavLink} to="/profile" exact>
                        <Person
                            size="40"
                            color={activeNavIcon === NavIcon.Profile ? negatedHexTheme : 'currentColor'}
                        />
                    </Nav.Link>
                    <Nav.Link onClick={onSwitchThemeHandler} role="button">
                        {theme === 'dark' ? <Toggle2Off size="40" /> : <Toggle2On size="40" />}
                    </Nav.Link>
                    <Nav.Link
                        onMouseEnter={onLogoutHoverEnterHandler}
                        onMouseLeave={onLogoutHoverLeaveHandler}
                        onClick={onLogout}
                        role="button"
                    >
                        {logoutIcon === LogoutIcon.Open ? <DoorOpen size="40" /> : <DoorClosed size="40" />}
                    </Nav.Link>
                </Fragment>
            )}
        </Nav>
    );
};

export default Links;
