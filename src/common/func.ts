import { List, ListCardOrderPayload } from '../store/lists/types';
import { ResponseError, StoredData, ThemeOption, ColorOption } from './types';
import { LocalKey } from './values';

export const devLog = (err: unknown): void => {
    process.env.NODE_ENV === 'development' && console.log(err);
};

export const getCls = (...args: string[]): string => args.join(' ');

export const negateTheme = (theme: ThemeOption): ThemeOption => {
    return theme === 'dark' ? 'light' : 'dark';
};

export const getColorText = (color: ColorOption): ThemeOption => {
    return ['light', 'yellow'].includes(color) ? 'dark' : 'light';
};

export const themeToHex = (theme: ThemeOption, body?: boolean): string => {
    if (body) {
        return theme === 'dark' ? '#4b4e52' : '#ccc';
    }
    return theme === 'dark' ? '#343a40' : '#fff';
};

export const getAuthHeader = (): { headers: { Authorization: string } } => {
    return {
        headers: {
            Authorization: `Bearer ${getLocalV()?._token}`
        }
    };
};

//eslint-disable-next-line
export const getError = (err: any): ResponseError => {
    let message: string;
    try {
        if (err.response.status === 511) {
            document.location.pathname = '/';
        }
        message = err.response.data.message;
    } catch {
        message = 'The server seems to be unresponsive. Please try again later.';
    }
    return { message };
};

export const setLocalV = (
    data: string | Record<string, unknown>,
    key: string = LocalKey.Token,
    encode = true
): void => {
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
    parse = true,
    decode = true
): T | null {
    if (document.location.pathname !== '/no-local-storage') {
        try {
            const item: string | null = localStorage.getItem(key);
            if (item) {
                const readable = decode ? atob(item) : item;
                return parse ? JSON.parse(readable) : readable;
            }
        } catch (err) {
            devLog(err);
            document.location.pathname = '/no-local-storage';
        }
    }
    return null;
}

export const getUpdatedListOrder = (
    currentOrder: string[],
    srcIdx: number,
    desIdx: number
): string[] => {
    const [src] = currentOrder.splice(srcIdx, 1);
    currentOrder.splice(desIdx, 0, src);
    return currentOrder;
};

export const getUpdatedCardOrder = (
    lists: List[],
    targetId: string,
    srcId: string,
    srcIdx: number,
    desId: string,
    desIdx: number
): ListCardOrderPayload | null => {
    const newLists = [...lists];
    const srcListIdx = newLists.findIndex((list) => list._id === srcId);
    const desListIdx = newLists.findIndex((list) => list._id === desId);
    if (srcListIdx > -1 && desListIdx > -1) {
        const srcIsDes = srcListIdx === desListIdx;
        const targetIdx = newLists[srcListIdx].cards.findIndex((card) => card._id === targetId);
        if (targetIdx > -1) {
            const newSrcCards = [...newLists[srcListIdx].cards];
            const newSrcCardOrder = [...newLists[srcListIdx].cardOrder];
            const newDesCards = [...newLists[desListIdx].cards];
            const newDesCardOrder = [...newLists[desListIdx].cardOrder];

            const [orderTarget] = newSrcCardOrder.splice(srcIdx, 1);
            (srcIsDes ? newSrcCardOrder : newDesCardOrder).splice(desIdx, 0, orderTarget);
            if (!srcIsDes) {
                const [cardTarget] = newSrcCards.splice(targetIdx, 1);
                newDesCards.push({ ...cardTarget, owner: newLists[desListIdx]._id });
            }
            return {
                src: {
                    idx: srcListIdx,
                    cards: newSrcCards,
                    cardOrder: newSrcCardOrder
                },
                des: {
                    idx: desListIdx,
                    cards: newDesCards,
                    cardOrder: newDesCardOrder
                }
            };
        }
    }
    return null;
};
