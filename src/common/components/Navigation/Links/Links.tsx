import React, { FC, Fragment, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useHistory } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { HouseDoor, Kanban, Person, DoorOpen, DoorClosed, Toggle2On, Toggle2Off } from 'react-bootstrap-icons';

import { RootState } from '../../../../store';
import { switchUserTheme, logoutUser } from '../../../../store/actions';
import { getCls, negateTheme, themeToHex } from '../../../func';
import classes from './Links.module.css';

enum NavIcon {
    Home,
    Boards,
    Profile,
    None
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
    } else if (pathname === '/') {
        return NavIcon.Home;
    } else {
        return NavIcon.None;
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
        dispatch(switchUserTheme({ theme: negateTheme(theme) }));
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
                        <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-bottom">home</Tooltip>}>
                            <HouseDoor
                                size="40"
                                color={activeNavIcon === NavIcon.Home ? negatedHexTheme : 'currentColor'}
                            />
                        </OverlayTrigger>
                    </Nav.Link>
                    <Nav.Link onClick={onNavIconClick.bind(null, NavIcon.Boards)} as={NavLink} to="/boards" exact>
                        <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-bottom">boards</Tooltip>}>
                            <Kanban
                                size="40"
                                color={activeNavIcon === NavIcon.Boards ? negatedHexTheme : 'currentColor'}
                            />
                        </OverlayTrigger>
                    </Nav.Link>
                    <Nav.Link onClick={onNavIconClick.bind(null, NavIcon.Profile)} as={NavLink} to="/profile" exact>
                        <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-bottom">profile</Tooltip>}>
                            <Person
                                size="40"
                                color={activeNavIcon === NavIcon.Profile ? negatedHexTheme : 'currentColor'}
                            />
                        </OverlayTrigger>
                    </Nav.Link>
                    <Nav.Link onClick={onSwitchThemeHandler} role="button">
                        <OverlayTrigger
                            placement="bottom"
                            overlay={<Tooltip id="tooltip-bottom">switch theme</Tooltip>}
                        >
                            {theme === 'dark' ? <Toggle2Off size="40" /> : <Toggle2On size="40" />}
                        </OverlayTrigger>
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
