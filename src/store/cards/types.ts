import { Checklist } from '../checklists/types';
import { MId, Owner, ThemeOption } from '../../common/types';

export interface Card extends MId, Owner {
    name: string;
    description: string;
    theme: ThemeOption;
    checklists: Checklist[];
    checklistOrder: string[];
}
