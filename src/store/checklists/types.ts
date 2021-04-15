import { MId, Owner } from '../../common/types';

export interface Checklist extends MId, Owner {
    objective: string;
    isCompleted: boolean;
}
