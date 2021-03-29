import { useEffect, Fragment, useCallback } from 'react';
import { BrowserRouter, Switch, Route, Redirect, useHistory } from 'react-router-dom';

import Navigation from './common/components/Maneuverable/Navigation';
import UserBoards from './boards/pages/UserBoards';
import UserBoard from './boards/pages/UserBoard';
import UpdateUser from './user/pages/UpdateUser';
import Auth from './user/pages/Auth';
import { AuthContext, ThemeContext } from './common/context';
import { useAuth, IAuthHook, useTheme, IThemeHook } from './common/hooks';
import { Functional, getLocalV, LocalKey, removeLocalV, setLocalV, StoredData } from './common/util';
import classes from './App.module.css';

const App: Functional = () => {
    const history = useHistory();
    const { token, login, logout, userId }: IAuthHook = useAuth();
    const { color, setTheme, resetTheme }: IThemeHook = useTheme();

    useEffect(() => {
        const timer: NodeJS.Timeout | null = getLocalV<NodeJS.Timeout>(LocalKey.Timer, false, false);
        if (!!token && timer === null) {
            const data = getLocalV<StoredData>();
            if (data !== null) {
                const timer = setTimeout(() => {
                    removeLocalV(LocalKey.Timer);
                    logout();
                    history.push('/');
                }, data._expires - Date.now());
                setLocalV(timer, LocalKey.Timer, false);
            }
        }
    });

    const appLogout = useCallback(() => {
        const timer: NodeJS.Timeout | null = getLocalV<NodeJS.Timeout>(LocalKey.Timer, false, false);
        if (timer !== null) {
            clearTimeout(timer);
            setLocalV(timer, LocalKey.Timer, false);
        }
        logout();
    }, [logout]);

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
                                    <UpdateUser />
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
                            <a href="https://github.com/lindeneg/arranger" target="_blank" rel="noreferrer">
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
