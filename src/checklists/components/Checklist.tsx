import React, { FC } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import ListGroup from 'react-bootstrap/ListGroup';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { Trash, Circle, CheckCircle } from 'react-bootstrap-icons';

import { Checklist as ChecklistType } from '../../store/checklists/types';
import { ThemeOption, getCls } from '../../common';
import classes from '../../cards/components/Cards.module.css';

interface ChecklistProps extends ChecklistType {
    id: string;
    index: number;
    colorText: ThemeOption;
    onClick: () => void;
    onToggle: () => void;
    onDelete: () => void;
}

const Checklist: FC<ChecklistProps> = (props) => {
    return (
        <Draggable draggableId={props.id} index={props.index}>
            {(provided) => (
                <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    className="d-flex align-items-baseline justify-content-between"
                >
                    <ListGroup.Item
                        role="button"
                        onClick={props.onClick}
                        className={getCls('mb-3', classes.name)}
                        style={{
                            backgroundColor: 'transparent',
                            width: '90%',
                            wordBreak: 'break-all',
                            fontStyle: props.isCompleted ? 'italic' : '',
                            textDecoration: props.isCompleted ? 'line-through' : ''
                        }}
                    >
                        {props.objective}
                    </ListGroup.Item>
                    {props.isCompleted ? (
                        <CheckCircle onClick={props.onToggle} role="button" size="25" />
                    ) : (
                        <Circle onClick={props.onToggle} role="button" size="25" />
                    )}
                    <OverlayTrigger
                        placement="bottom"
                        overlay={<Tooltip id="tooltip-bottom">delete checklist</Tooltip>}
                    >
                        <Trash onClick={props.onDelete} role="button" size="25" />
                    </OverlayTrigger>
                </div>
            )}
        </Draggable>
    );
};

export default Checklist;
