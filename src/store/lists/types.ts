import { Card } from '../cards/types';
import { MId, Owner } from '../../common/types';

export interface List extends MId, Owner {
	name: string;
	cards: Card[];
	cardOrder: string[];
}
