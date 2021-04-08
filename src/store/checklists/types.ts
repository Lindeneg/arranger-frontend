import { MId, Orderable, Owner } from '../../common/types';

export interface Checklist extends MId, Orderable, Owner {
    objective: string;
    isCompleted: boolean;
}
