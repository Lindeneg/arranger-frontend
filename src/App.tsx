import React, { FC, useState, useEffect, Fragment } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Auth from './user/pages/Auth';
import UserBoards from './boards/pages/UserBoards';
import UserBoard from './boards/pages/UserBoard';
import { Navigation } from './common/components';
import { RootState } from './store';
import { loginUser } from './store/actions';
import { StoredData, getLocalV, themeToHex } from './common';

const App: FC = () => {
    const { token, theme } = useSelector((state: RootState) => state.user);
    const [localData] = useState<StoredData | null>(getLocalV());
    const dispatch = useDispatch();

    useEffect(() => {
        if (token === null) {
            if (localData !== null && localData._expires > Date.now()) {
                dispatch(loginUser(null, localData));
            }
        }
    }, [dispatch, token, localData]);

    useEffect(() => {
        document.body.setAttribute(
            'style',
            `background-color: ${themeToHex(theme, true)} !important`
        );
    }, [theme]);

    return (
        <Fragment>
            <Navigation />
            <main className="mt-5">
                <Switch>
                    {localData?._token ? (
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
