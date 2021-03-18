import { SIndexable } from './types';

// values must correspond to id names in public html file
export enum HTMLHooks {
    Drawer = 'drawer-hook',
    Backdrop = 'backdrop-hook',
    Modal = 'modal-hook'
}

// TODO these are temp colors
export enum BoardColor {
    Default = '#0f3460',
    Red = 'red',
    Purple = 'purple',
    Green = 'green',
    Orange = 'orange'
}

export const RULE = {
    PW_MIN_LEN: 8,
    PW_MAX_LEN: 32,
    USR_MIN_LEN: 4,
    USR_MAX_LEN: 16,
    DEFAULT_MAX_LEN: 32,
    DES_MAX_LEN: 128
};

export const colorName: SIndexable<string> = {
    [BoardColor.Default]: 'Blue',
    [BoardColor.Red]: 'Red',
    [BoardColor.Purple]: 'Purple',
    [BoardColor.Green]: 'Green',
    [BoardColor.Orange]: 'Orange'
};
