import { BrowserRouter } from 'react-router-dom';

import Navigation from './common/components/Maneuverable/Navigation';
import { AuthContext } from './common/context';
import { useAuth, IAuthHook } from './common/hooks';
import { Functional } from './common/util';

const App: Functional = () => {
    const { token, login, logout, userId }: IAuthHook = useAuth();
    return (
        <AuthContext.Provider value={{ isLoggedIn: !!token, login, logout, userId, token }}>
            <BrowserRouter>
                <Navigation />
                <main style={{ marginTop: '5rem' }}></main>
            </BrowserRouter>
        </AuthContext.Provider>
    );
};

export default App;
