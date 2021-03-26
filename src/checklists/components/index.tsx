import { useState, useCallback, Fragment } from 'react';

import Checklist from './Checklist';
import { BaseProps, ChecklistResponse, Functional, UpdateStateAction } from '../../common/util';
import classes from './Checklists.module.css';

interface ChecklistsProps extends BaseProps {
    checklists: ChecklistResponse[];
    owner: string;
}

export interface StatefulChecklist extends Partial<ChecklistResponse> {
    isCreating?: boolean;
    isCompleted: boolean;
    description: string;
}

const Checklists: Functional<ChecklistsProps> = (props) => {
    const [editingChecklist, setEditingChecklist] = useState<StatefulChecklist | null>(null);
    const [checklists, setChecklists] = useState<ChecklistResponse[]>(props.checklists);

    const updateChecklists = useCallback(
        (action: UpdateStateAction, checklist: ChecklistResponse | string): void => {
            const newChecklists = [...checklists];
            if (action === UpdateStateAction.Create && typeof checklist !== 'string') {
                newChecklists.push(checklist);
            } else {
                const targetIdx = checklists.findIndex(
                    (e) => e._id === (typeof checklist !== 'string' ? checklist._id : checklist)
                );
                if (targetIdx > -1) {
                    if (action === UpdateStateAction.Delete) {
                        newChecklists.splice(targetIdx, 1);
                    }
                    if (action === UpdateStateAction.Update && typeof checklist !== 'string') {
                        newChecklists[targetIdx] = {
                            ...newChecklists[targetIdx],
                            description: checklist.description,
                            isCompleted: checklist.isCompleted
                        };
                    }
                }
            }
            setChecklists(newChecklists);
        },
        [checklists]
    );

    const onEditAccept = (checklist: ChecklistResponse): void => {
        setEditingChecklist(checklist);
    };

    const onCreateAccept = (): void => {
        setEditingChecklist({ description: '', isCompleted: false, owner: props.owner, isCreating: true });
    };

    const onEditDeny = (): void => {
        setEditingChecklist(null);
    };

    return (
        <div className={classes.Container}>
            {!editingChecklist && (
                <div className={classes.Checklists}>
                    {checklists.length > 0 && <h2>Checklist</h2>}
                    <Fragment>
                        {checklists.map((checklist) => (
                            <Checklist
                                isEditing={false}
                                key={checklist._id}
                                display={checklist}
                                updateChecklists={updateChecklists}
                                onEditDeny={onEditDeny}
                                onEditAccept={onEditAccept.bind(null, checklist)}
                            />
                        ))}
                    </Fragment>
                </div>
            )}
            {!editingChecklist ? (
                <Fragment>
                    {checklists.length > 0 && <hr />}
                    <div className={classes.AddChecklist} onClick={onCreateAccept}>
                        ADD CHECKLIST
                    </div>
                </Fragment>
            ) : (
                <Checklist
                    isEditing={true}
                    updateChecklists={updateChecklists}
                    onEditDeny={onEditDeny}
                    onEditAccept={() => null}
                    display={editingChecklist}
                />
            )}
        </div>
    );
};

export default Checklists;
