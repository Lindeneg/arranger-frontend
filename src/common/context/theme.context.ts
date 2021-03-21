import { createContext } from 'react';

export interface IThemeContext {
    color: string;
    setColor: (color: string) => void;
    resetColor: () => void;
}

export const ThemeContext = createContext<IThemeContext>({
    color: '',
    setColor: () => null,
    resetColor: () => null
});
