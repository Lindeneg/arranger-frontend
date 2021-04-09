import { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import Navbar from 'react-bootstrap/Navbar';
import { List } from 'react-bootstrap-icons';

import Links from './Links/Links';
import SideDrawer from './SideDrawer/SideDrawer';
import { RootState } from '../../../store';
import { getCls, negateTheme, themeToHex } from '../../func';

export const Navigation: FC = (props) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
    const { theme, token } = useSelector((state: RootState) => state.user);

    const onDrawerOpen = () => {
        setIsDrawerOpen(true);
    };
    const onDrawerClose = () => {
        setIsDrawerOpen(false);
    };

    return (
        <Navbar variant={theme} className={getCls('bg-' + theme, 'justify-content-between')} style={{ height: '5em' }}>
            <SideDrawer show={isDrawerOpen} onClose={onDrawerClose}>
                <Links onClick={onDrawerClose} />
            </SideDrawer>
            <Navbar.Brand className="d-none d-sm-block" href="/">
                Arranger
            </Navbar.Brand>
            <Links desktop />
            {!!token && (
                <List
                    className="d-md-none"
                    onClick={onDrawerOpen}
                    role="button"
                    fill={themeToHex(negateTheme(theme))}
                    size="4rem"
                />
            )}
        </Navbar>
    );
};

export default Navigation;
