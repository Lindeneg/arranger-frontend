import { useState, useCallback } from 'react';

export interface IThemeHook {
    color: string;
    setTheme: (color: string) => void;
    resetTheme: () => void;
}

export const useTheme = (): IThemeHook => {
    const [color, setColor] = useState<string>('#16213e');

    const setTheme = useCallback((newColor: string): void => {
        setColor(newColor);
    }, []);

    const resetTheme = useCallback((): void => {
        setColor('#16213e');
    }, []);

    return { color, setTheme, resetTheme };
};
