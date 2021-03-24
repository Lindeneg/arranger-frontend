import { useState, useEffect } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import Navigation from './common/components/Maneuverable/Navigation';
import UserBoards from './boards/pages/UserBoards';
import UserBoard from './boards/pages/UserBoard';
import Auth from './user/pages/Auth';
import { AuthContext, ThemeContext } from './common/context';
import { useAuth, IAuthHook, useTheme, IThemeHook } from './common/hooks';
import { Functional, getLocalV, StoredData } from './common/util';
import classes from './App.module.css';
import { Fragment } from 'react';

const App: Functional = () => {
    const { token, login, logout, userId }: IAuthHook = useAuth();
    const { color, setTheme, resetTheme }: IThemeHook = useTheme();
    const [logoutTimeOut, setLogoutTimeOut] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!!token && logoutTimeOut === null) {
            const data = getLocalV<StoredData>();
            if (data !== null) {
                console.log('setting timeout', data._expires - Date.now());
                const timer = setTimeout(() => {
                    console.log('logging out');
                    setLogoutTimeOut(null);
                    logout();
                    window.document.location.reload();
                }, data._expires - Date.now());
                setLogoutTimeOut(timer);
            }
        }
    }, [token, logoutTimeOut, logout]);

    const appLogout = () => {
        if (logoutTimeOut !== null) {
            console.log('clearling timeout');
            clearTimeout(logoutTimeOut);
            setLogoutTimeOut(null);
        }
        logout();
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn: !!token, login, logout: appLogout, userId, token }}>
            <ThemeContext.Provider value={{ color, setColor: setTheme, resetColor: resetTheme }}>
                <BrowserRouter>
                    <Navigation />
                    <main style={{ marginTop: '6.5rem' }}>
                        {token ? (
                            <Switch>
                                <Route path="/" exact>
                                    <Auth />
                                </Route>
                                <Route path="/boards" exact>
                                    <UserBoards />
                                </Route>
                                <Route path="/profile" exact>
                                    <div>PROFILE</div>
                                </Route>
                                <Route path="/board/:boardId" exact>
                                    <UserBoard />
                                </Route>
                                <Redirect to="/boards" />
                            </Switch>
                        ) : (
                            <Fragment>
                                <Route path="/" exact>
                                    <Auth />
                                </Route>
                                <Redirect to="/" />
                            </Fragment>
                        )}
                    </main>
                    <footer style={{ background: color }} className={classes.Footer}>
                        <span>
                            <span className={classes.Clickable}>
                                <a href="https://www.lindeneg.org" target="_blank" rel="noreferrer">
                                    christian lindeneg
                                </a>
                            </span>
                            @ 2021
                        </span>
                        -
                        <span className={classes.Clickable}>
                            <a href="https://github.com/lindeneg/arranger-frontend" target="_blank" rel="noreferrer">
                                source-code
                            </a>
                        </span>{' '}
                    </footer>
                </BrowserRouter>
            </ThemeContext.Provider>
        </AuthContext.Provider>
    );
};

export default App;
