import { Color, ThemeOption } from './types';

export const colorClassMap: { [K in keyof Color]: string } = {
    blue: 'primary',
    gray: 'secondary',
    green: 'success',
    red: 'danger',
    yellow: 'warning',
    teal: 'info',
    light: 'light',
    dark: 'dark'
};

export const defaultTheme: ThemeOption = 'light';

export enum LocalKey {
    Token = '_arngrprv'
}

export const emptyDescription = 'Please enter a description';
