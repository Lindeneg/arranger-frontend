import { ThemeColor } from './types';

export const themeColorClassMap: { [K in keyof ThemeColor]: string } = {
    blue: 'primary',
    gray: 'secondary',
    green: 'success',
    red: 'danger',
    yellow: 'warning',
    teal: 'info',
    light: 'light',
    dark: 'dark'
};