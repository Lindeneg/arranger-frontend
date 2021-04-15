import { List } from '../lists/types';
import { ColorOption, MId, Requester } from '../../common/types';

export interface Board<T extends string | List> extends MId {
	name: string;
	owner: string;
	color: ColorOption;
	lists: T[];
	listOrder: string[];
}

export interface BoardState extends Requester {
	board: Board<List> | null;
	boards: Board<string>[] | null;
}

export type BoardPayload<T extends keyof Board<List>> = Partial<Pick<Board<List>, T>>;
