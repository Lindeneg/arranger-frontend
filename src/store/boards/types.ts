import { List } from '../lists/types';
import { MId, Orderable, ThemeOption, Requester } from '../../common/types';

export interface Board<T extends string | List> extends MId, Orderable {
    name: string;
    owner: string;
    theme: ThemeOption;
    lists: T[];
}

export interface BoardState extends Requester {
    board: Board<List> | null;
    boards: Board<string>[] | null;
}

export type BoardPayload<T extends keyof Board<string>> = Pick<Board<string>, T>;
