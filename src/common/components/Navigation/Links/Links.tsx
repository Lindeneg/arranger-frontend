import { FC, Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useHistory } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import { HouseDoor, Kanban, Person, DoorOpen, DoorClosed, Toggle2On, Toggle2Off } from 'react-bootstrap-icons';

import { RootState } from '../../../../store';
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
    const { location } = useHistory();
    const { token, theme } = useSelector((state: RootState) => state.user);
    const [negatedHexTheme] = useState<string>(themeToHex(negateTheme(theme)));
    const [activeNavIcon, setActiveNavIcon] = useState<NavIcon | null>(null);
    const [logoutIcon, setLogoutIcon] = useState<LogoutIcon>(LogoutIcon.Open);

    useEffect(() => {
        const icon = pathnameToNavIcon(location.pathname);
        if (icon !== activeNavIcon) {
            setActiveNavIcon(icon);
        }
    }, [activeNavIcon, location.pathname]);

    const onLogout = (): void => {
        console.log('logout');
    };

    const onSwitchThemeHandler = (): void => {
        console.log('switch theme');
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

    // TODO look for truthy token
    return (
        <Nav className={getCls(props.desktop ? 'd-none d-md-flex ' + classes.desktop : classes.mobile)}>
            {!!!token && (
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
