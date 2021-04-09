import { StoredData, ThemeOption } from './types';
import { LocalKey } from './values';

export const devLog = (err: any): void => {
    process.env.NODE_ENV === 'development' && console.log(err);
};

export const getCls = (...args: string[]): string => args.join(' ');

export const negateTheme = (theme: ThemeOption): ThemeOption => {
    return theme === 'dark' ? 'light' : 'dark';
};

export const themeToHex = (theme: ThemeOption, body?: boolean): string => {
    if (body) {
        return theme === 'dark' ? '#4b4e52' : '#ccc';
    }
    return theme === 'dark' ? '#343a40' : '#fff';
};

export const isResponseOk = (status: number): boolean => status >= 200 && status <= 299;

export const getAuthHeader = () => {
    return {
        headers: {
            Authorization: `Bearer ${getLocalV()?._token}`
        }
    };
};

export const setLocalV = (data: string | object, key: string = LocalKey.Token, encode = true): void => {
    try {
        const mData: string = typeof data === 'string' ? data : JSON.stringify(data);
        localStorage.setItem(key, encode ? btoa(mData) : mData);
    } catch (err) {
        devLog(err);
    }
};

export const removeLocalV = (key: string = LocalKey.Token): void => {
    localStorage.removeItem(key);
};

export function getLocalV<T = StoredData>(
    key: string = LocalKey.Token,
    parse: boolean = true,
    decode = true
): T | null {
    const item: string | null = localStorage.getItem(key);
    if (item) {
        const readable = decode ? atob(item) : item;
        return parse ? JSON.parse(readable) : readable;
    }
    return null;
}
