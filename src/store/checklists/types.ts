import { MId, Owner, Requester } from '../../common/types';

export interface Checklist extends MId, Owner {
    objective: string;
    isCompleted: boolean;
}

export type ChecklistState = Requester;

export type ChecklistPayload<T extends keyof Checklist> = Pick<Checklist, T>;