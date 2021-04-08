import { useEffect, Fragment, useCallback } from 'react';
import { BrowserRouter, Switch, Route, Redirect, useHistory } from 'react-router-dom';

const App: Functional = () => {
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
