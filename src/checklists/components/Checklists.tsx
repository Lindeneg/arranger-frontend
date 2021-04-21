import React, { FC, Fragment, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import ListGroup from 'react-bootstrap/ListGroup';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Alert from 'react-bootstrap/Alert';
import { PlusCircle } from 'react-bootstrap-icons';

import Checklist from './Checklist';
import ChecklistInput from './ChecklistInput';
import { RootState } from '../../store';
import {
    createChecklist,
    updateChecklist,
    updateCardChecklistOrder,
    deleteChecklist
} from '../../store/actions';
import { ChecklistPayload } from '../../store/checklists/types';
import { ThemeOption, DropType, getUpdatedListOrder } from '../../common';
import { Hr } from '../../common/components';

const Checklists: FC<{ colorText: ThemeOption }> = (props) => {
    const dispatch = useDispatch();
    const { card } = useSelector((state: RootState) => state.card);
    const [creating, setCreating] = useState<boolean>(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const onCreate = (objective: string): void => {
        card && dispatch(createChecklist({ objective, owner: card._id }));
    };

    const onUpdate = (
        id: string,
        payload: Partial<ChecklistPayload<'objective' | 'isCompleted'>>
    ): void => {
        dispatch(updateChecklist(id, payload));
    };

    const onUpdateObjective = (
        id: string | null,
        currentObjetive: string,
        newObjective: string
    ): void => {
        if (currentObjetive !== newObjective) {
            const pl = { objective: newObjective };
            if (id) {
                onUpdate(id, pl);
            } else if (editingId) {
                onUpdate(editingId, pl);
            }
        }
    };

    const onToggleChecklistState = (id: string, currentState: boolean): void => {
        onUpdate(id, { isCompleted: !currentState });
    };

    const onDelete = (id: string): void => {
        dispatch(deleteChecklist(id));
    };

    const onCreateAccept = (): void => {
        setCreating(true);
        setEditingId(null);
    };

    const onEditAccept = (id: string): void => {
        setEditingId(id);
        setCreating(false);
    };

    const onActionDeny = (): void => {
        setCreating(false);
        setEditingId(null);
    };

    const onDragEnd = (result: DropResult): void => {
        if (
            card &&
            result.type === DropType.Checklist &&
            result.destination &&
            result.destination.index !== result.source.index
        ) {
            dispatch(
                updateCardChecklistOrder(
                    card._id,
                    result.source.index,
                    result.destination.index,
                    getUpdatedListOrder(
                        [...card.checklistOrder],
                        result.source.index,
                        result.destination.index
                    )
                )
            );
        }
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            {card && (
                <Fragment>
                    <div className="d-flex align-items-baseline justify-content-between">
                        <h3>Checklists</h3>
                        <OverlayTrigger
                            placement="bottom"
                            overlay={<Tooltip id="tooltip-bottom">add checklist</Tooltip>}
                        >
                            <PlusCircle role="button" size="25" onClick={onCreateAccept} />
                        </OverlayTrigger>
                    </div>
                    <Hr colorText={props.colorText} />
                    <Droppable droppableId={card._id} type={DropType.Checklist}>
                        {(provided) => (
                            <ListGroup {...provided.droppableProps} ref={provided.innerRef}>
                                {card.checklistOrder.map((id, index) => {
                                    const checklist = card.checklists.find((cl) => cl._id === id);
                                    if (checklist) {
                                        if (editingId && editingId === checklist._id) {
                                            return (
                                                <ChecklistInput
                                                    key={index}
                                                    colorText={props.colorText}
                                                    objective={checklist.objective}
                                                    onCreate={onUpdateObjective.bind(
                                                        null,
                                                        null,
                                                        checklist.objective
                                                    )}
                                                    onClose={onActionDeny}
                                                />
                                            );
                                        }
                                        return (
                                            <Checklist
                                                key={checklist._id}
                                                id={checklist._id}
                                                index={index}
                                                onClick={onEditAccept.bind(null, checklist._id)}
                                                colorText={props.colorText}
                                                onToggle={onToggleChecklistState.bind(
                                                    null,
                                                    checklist._id,
                                                    checklist.isCompleted
                                                )}
                                                onDelete={onDelete.bind(null, checklist._id)}
                                                {...checklist}
                                            />
                                        );
                                    }
                                    return null;
                                })}
                            </ListGroup>
                        )}
                    </Droppable>
                    {!creating && card.checklistOrder.length <= 0 && (
                        <Alert variant="info">No checklists found. Go ahead and create one.</Alert>
                    )}
                    {creating && (
                        <ChecklistInput
                            onCreate={onCreate}
                            onClose={onActionDeny}
                            colorText={props.colorText}
                        />
                    )}
                </Fragment>
            )}
        </DragDropContext>
    );
};

export default Checklists;
