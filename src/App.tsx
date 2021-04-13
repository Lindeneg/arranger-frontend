import React, { FC, useEffect, Fragment } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Auth from './user/pages/Auth';
import UserBoards from './boards/pages/UserBoards';
import UserBoard from './boards/pages/UserBoard';
import { Navigation } from './common/components';
import { RootState } from './store';
import { loginUser } from './store/actions';
import { getLocalV, themeToHex } from './common/func';

const App: FC = () => {
    const { token, theme } = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
        if (token === null) {
            const authData = getLocalV();
            if (authData !== null && authData._expires > Date.now()) {
                dispatch(loginUser(null, authData));
            }
        }
    }, [dispatch, token]);

    useEffect(() => {
        document.body.setAttribute('style', `background-color: ${themeToHex(theme, true)} !important`);
    }, [theme]);

    return (
        <Fragment>
            <Navigation />
            <main className="mt-5">
                <Switch>
                    {token !== null ? (
                        <Switch>
                            <Route path="/" exact>
                                <Auth />
                            </Route>
                            <Route path="/boards" exact>
                                <UserBoards />
                            </Route>
                            <Route path="/board/:boardId" exact>
                                <UserBoard />
                            </Route>
                            <Route path="/profile" exact>
                                {/* <UpdateUser /> */}
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
                </Switch>
            </main>
        </Fragment>
    );
};

export default App;
