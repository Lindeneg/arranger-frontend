import { Card } from '../cards/types';
import { MId, Owner, Requester } from '../../common/types';

export interface List<T = Card[]> extends MId, Owner {
    name: string;
    cards: T;
    cardOrder: string[];
}

export interface ListState extends Requester {
    lists: List[];
}

export type ListPayload<T extends keyof List<Card>> = Pick<List<Card>, T>;
export type ListCardOrderPayload = {
    src: { idx: number; cards: Card[]; cardOrder: string[] };
    des: { idx: number; cards: Card[]; cardOrder: string[] };
    targetId: string;
};
