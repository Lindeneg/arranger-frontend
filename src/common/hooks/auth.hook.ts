import { useState, useCallback } from 'react';

import { getLocalV, removeLocalV, setLocalV, StoredData, Login } from '../../common/util';

export interface IAuthHook {
    token: string;
    userId: string;
    login: Login;
    logout: () => void;
}

/**
 * Management of user-authentication state for other components interested in such information.
 */

export const useAuth = (): IAuthHook => {
    const data = getLocalV<StoredData>();
    const [userId, setUserId] = useState<string>(data && Date.now() < data._expires ? data._id : '');
    const [token, setToken] = useState<string>(data && Date.now() < data._expires ? data._token : '');

    const login = useCallback((userId: string, responseToken: string, tokenExpire?: number) => {
        const expires: number = tokenExpire || Date.now() + 1000 * 60 * 60;
        setUserId(userId);
        setToken(responseToken);
        setLocalV({ _id: userId, _token: responseToken, _expires: expires });
    }, []);

    const logout = useCallback(() => {
        setUserId('');
        setToken('');
        removeLocalV();
    }, []);

    return { token, userId, login, logout };
};
