import { FC, useEffect, Fragment } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Auth from './user/pages/Auth';
import { RootState } from './store';
import { loginUser } from './store/actions';
import { getLocalV } from './common/func';

const App: FC = () => {
    const { token } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        if (token !== null) {
            const authData = getLocalV();
            if (authData !== null) {
                dispatch(loginUser(null, authData));
            }
        }
    }, [dispatch, token]);

    return (
        <Fragment>
            {/*<Navigation />*/}
            <main>
                <Switch>
                    {token !== null ? (
                        <Switch>
                            <Route path="/" exact>
                                <Auth />
                            </Route>
                            <Route path="/boards" exact>
                                {/* <UserBoards /> */}
                            </Route>
                            <Route path="/profile" exact>
                                {/* <UpdateUser /> */}
                            </Route>
                            <Route path="/board/:boardId" exact>
                                {/* <UserBoard /> */}
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
