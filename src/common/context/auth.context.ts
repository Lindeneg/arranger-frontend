import { createContext, Context } from 'react';

import { Login } from '../util';

interface IAuthContext {
    isLoggedIn: boolean;
    userId: string;
    token: string;
    login: Login;
    logout: () => void;
}

export const AuthContext: Context<IAuthContext> = createContext<IAuthContext>({
    isLoggedIn: false,
    userId: '',
    token: '',
    login: () => null,
    logout: () => null
});
