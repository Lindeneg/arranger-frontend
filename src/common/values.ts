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

export const defaultTheme: ThemeOption = 'dark';

export enum LocalKey {
    Token = '_arngrprv',
    Timer = '_arngprv_timer'
}
