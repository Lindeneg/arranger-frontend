import React, { FC } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { Trash, Circle, CheckCircle } from 'react-bootstrap-icons';

import { Checklist as ChecklistType } from '../../store/checklists/types';
import { ThemeOption, getCls } from '../../common';
import classes from '../../cards/components/Cards.module.css';

interface ChecklistProps extends ChecklistType {
    colorText: ThemeOption;
    onClick: () => void;
    onToggle: () => void;
    onDelete: () => void;
}

const Checklist: FC<ChecklistProps> = (props) => {
    return (
        <div className="d-flex align-items-baseline justify-content-between">
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
                <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip id="tooltip-bottom">uncheck</Tooltip>}
                >
                    <CheckCircle onClick={props.onToggle} role="button" size="25" />
                </OverlayTrigger>
            ) : (
                <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip id="tooltip-bottom">check</Tooltip>}
                >
                    <Circle onClick={props.onToggle} role="button" size="25" />
                </OverlayTrigger>
            )}
            <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip id="tooltip-bottom">delete checklist</Tooltip>}
            >
                <Trash onClick={props.onDelete} role="button" size="25" />
            </OverlayTrigger>
        </div>
    );
};

export default Checklist;
