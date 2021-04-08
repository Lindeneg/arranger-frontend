import { Card } from '../cards/types';
import { MId, Orderable, Owner } from '../../common/types';

export interface List extends MId, Orderable, Owner {
    name: string;
    cards: Card[];
}
