import { Checklist } from '../checklists/types';
import { MId, Owner, ColorOption } from '../../common/types';

export interface Card extends MId, Owner {
	name: string;
	description: string;
	color: ColorOption;
	checklists: Checklist[];
	checklistOrder: string[];
}
