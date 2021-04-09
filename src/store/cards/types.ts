import { Checklist } from '../checklists/types';
import { MId, Owner, CardColorOption } from '../../common/types';

export interface Card extends MId, Owner {
    name: string;
    description: string;
    color: CardColorOption;
    checklists: Checklist[];
    checklistOrder: string[];
}
