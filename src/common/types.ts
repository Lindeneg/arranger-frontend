export type MId = { _id: string };

export type Owner = { owner: string; indirectOwner: string };

export type ColorOption = 'blue' | 'gray' | 'green' | 'red' | 'yellow' | 'teal' | 'light' | 'dark';
export type ThemeOption = 'light' | 'dark';

export type Color = {
    blue: string;
    gray: string;
    green: string;
    red: string;
    yellow: string;
    teal: string;
    light: string;
    dark: string;
};

export type ResponseError = { message: string };

export type Requester = {
    requesting: boolean;
    requested: boolean;
    error: string | null;
};

export interface StoredData {
    _id: string;
    _token: string;
    _theme: ThemeOption;
    _expires: number;
}
