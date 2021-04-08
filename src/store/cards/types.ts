import { Checklist } from '../checklists/types';
import { MId, Orderable, Owner, ThemeOption } from '../../common/types';

export interface Card extends MId, Orderable, Owner {
    name: string;
    description: string;
    theme: ThemeOption;
    checklists: Checklist[];
}
