import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import Navigation from './common/components/Maneuverable/Navigation';
import UserBoards from './boards/pages/UserBoards';
import Auth from './user/pages/Auth';
import { AuthContext } from './common/context';
import { useAuth, IAuthHook } from './common/hooks';
import { Functional } from './common/util';
import classes from './App.module.css';
import { Fragment } from 'react';

const App: Functional = () => {
    const { token, login, logout, userId }: IAuthHook = useAuth();
    return (
        <AuthContext.Provider value={{ isLoggedIn: !!token, login, logout, userId, token }}>
            <BrowserRouter>
                <Navigation />
                <main style={{ marginTop: '5rem' }}>
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
                                <div>BOARD</div>
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
                <footer className={classes.Footer}>
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
        </AuthContext.Provider>
    );
};

export default App;
