import React, { FC, useEffect, Fragment } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import UserAuth from './user/pages/UserAuth';
import UserProfile from './user/pages/UserProfile';
import UserBoards from './boards/pages/UserBoards';
import UserBoard from './boards/pages/UserBoard';
import NoLocalStorage from './user/components/NoLocalStorage';
import { Navigation, Footer } from './common/components';
import { RootState } from './store';
import { loginUser, logoutUser } from './store/actions';
import { getLocalV, themeToHex } from './common';

const App: FC = () => {
    const { token, theme } = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
        if (token === null) {
            const localData = getLocalV();

            if (localData !== null) {
                if (localData._expires > Date.now()) {
                    dispatch(loginUser(null, localData));
                } else {
                    dispatch(logoutUser());
                }
            }
        }
    }, [dispatch, token]);

    useEffect(() => {
        document.body.setAttribute(
            'style',
            `background-color: ${themeToHex(theme, true)} !important`
        );
    }, [theme]);

    return (
        <Fragment>
            <Navigation />
            <main className="mt-4">
                <Switch>
                    {getLocalV()?._token ? (
                        <Switch>
                            <Route path="/" exact>
                                <UserAuth />
                            </Route>
                            <Route path="/boards" exact>
                                <UserBoards />
                            </Route>
                            <Route path="/board/:boardId" exact>
                                <UserBoard />
                            </Route>
                            <Route path="/profile" exact>
                                <UserProfile />
                            </Route>
                            <Redirect to="/boards" />
                        </Switch>
                    ) : (
                        <Switch>
                            <Route path="/" exact>
                                <UserAuth />
                            </Route>
                            <Route path="/no-local-storage" exact>
                                <NoLocalStorage />
                            </Route>
                            <Redirect to="/" />
                        </Switch>
                    )}
                </Switch>
            </main>
            <Footer />
        </Fragment>
    );
};

export default App;
