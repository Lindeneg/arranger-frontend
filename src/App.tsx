import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import Navigation from './common/components/Maneuverable/Navigation';
import UserBoards from './boards/pages/UserBoards';
import Auth from './user/pages/Auth';
import { AuthContext } from './common/context';
import { useAuth, IAuthHook } from './common/hooks';
import { Functional } from './common/util';

const App: Functional = () => {
    const { token, login, logout, userId }: IAuthHook = useAuth();
    return (
        <AuthContext.Provider value={{ isLoggedIn: !!token, login, logout, userId, token }}>
            <BrowserRouter>
                <Navigation />
                <main style={{ marginTop: '5rem' }}>
                    {token ? (
                        <Switch>
                            <Route path="/boards" exact>
                                <UserBoards />
                            </Route>
                            <Route path="/board/:boardId" exact>
                                {/* Board */}
                            </Route>
                            <Route path="/profile" exact>
                                {/* User Profile */}
                            </Route>
                            <Redirect to="/boards" />
                        </Switch>
                    ) : (
                        <Switch>
                            <Route path="/" exact>
                                <Auth />
                            </Route>
                            <Redirect to="/" />
                        </Switch>
                    )}
                </main>
            </BrowserRouter>
        </AuthContext.Provider>
    );
};

export default App;
