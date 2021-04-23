import { Checklist } from '../checklists/types';
import { MId, Owner, Requester, ColorOption } from '../../common/types';

export interface Card extends MId, Owner {
    name: string;
    description: string;
    color: ColorOption;
    checklists: Checklist[];
    checklistOrder: string[];
}

export interface CardState extends Requester {
    card: Card | null;
}

export type CardPayload<T extends keyof Card> = Pick<Card, T>;
