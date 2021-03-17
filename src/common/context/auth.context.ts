import { createContext, Context } from 'react';

import { Login } from '../types';

interface IAuthContext {
    isLoggedIn: boolean;
    userId: string;
    token: string;
    login: Login;
    logout: () => void;
}

const AuthContext: Context<IAuthContext> = createContext<IAuthContext>({
    isLoggedIn: false,
    userId: '',
    token: '',
    login: () => null,
    logout: () => null
});

export default AuthContext;
