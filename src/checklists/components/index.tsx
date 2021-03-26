import { useState, Fragment } from 'react';

import Checklist from './Checklist';
import { BaseProps, ChecklistResponse, Functional } from '../../common/util';
import classes from './Checklists.module.css';

interface ChecklistsProps extends BaseProps {
    checklists: ChecklistResponse[];
}

export interface StatefulChecklist extends Partial<ChecklistResponse> {
    isCreating?: boolean;
    isCompleted: boolean;
    description: string;
}

const Checklists: Functional<ChecklistsProps> = (props) => {
    const [editingChecklist, setEditingChecklist] = useState<StatefulChecklist | null>(null);

    const onEditAccept = (checklist: ChecklistResponse): void => {
        setEditingChecklist(checklist);
    };

    const onCreateAccept = (): void => {
        setEditingChecklist({ description: '', isCompleted: false, isCreating: true });
    };

    const onEditDeny = (): void => {
        setEditingChecklist(null);
    };

    return (
        <div className={classes.Container}>
            {!editingChecklist && (
                <Fragment>
                    {props.checklists.map((checklist) => (
                        <Checklist
                            isEditing={false}
                            key={checklist._id}
                            display={checklist}
                            onEditDeny={onEditDeny}
                            onEditAccept={onEditAccept.bind(null, checklist)}
                        />
                    ))}
                </Fragment>
            )}
            {!editingChecklist ? (
                <div className={classes.AddChecklist} onClick={onCreateAccept}>
                    ADD CHECKLIST
                </div>
            ) : (
                <Checklist
                    isEditing={true}
                    onEditDeny={onEditDeny}
                    onEditAccept={() => null}
                    display={editingChecklist}
                />
            )}
        </div>
    );
};

export default Checklists;
