import React, { FC, Fragment, useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Alert from 'react-bootstrap/Alert';
import { PlusCircle } from 'react-bootstrap-icons';

import Checklist from './Checklist';
import { Checklist as ChecklistType } from '../../store/checklists/types';
import { ThemeOption } from '../../common';
import { Hr, CreationInput } from '../../common/components';

const testChecklists = [
    {
        _id: '1',
        owner: '',
        objective: 'do something useful',
        isCompleted: false
    },
    {
        _id: '2',
        owner: '',
        objective: 'some objective here',
        isCompleted: true
    },
    {
        _id: '3',
        owner: '',
        objective: 'AJAJSFJAFJAFHSAFUAHFAUISFHASFIA',
        isCompleted: false
    }
] as ChecklistType[];

const testOrder = ['2', '3', '1'];

const Checklists: FC<{ colorText: ThemeOption }> = (props) => {
    const [creating, setCreating] = useState<boolean>(false);
    return (
        <Fragment>
            <div className="d-flex align-items-baseline justify-content-between">
                <h3>Checklists</h3>
                <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip id="tooltip-bottom">add checklist</Tooltip>}
                >
                    <PlusCircle role="button" size="25" onClick={() => setCreating(true)} />
                </OverlayTrigger>
            </div>
            <Hr colorText={props.colorText} />
            <ListGroup>
                {testOrder.map((order, index) => {
                    const checklist = testChecklists.find((cl) => cl._id === order);
                    if (checklist) {
                        return <Checklist key={index} {...checklist} />;
                    }
                    return null;
                })}
            </ListGroup>
            {!creating && 1 < 0 && (
                <Alert variant="info">No checklists found. Go ahead and create one.</Alert>
            )}
            {creating && (
                <CreationInput
                    style={{ width: '60%' }}
                    type="checklist"
                    inputMaxLength={30}
                    customColor={props.colorText}
                    placeholder="Checklist objective..."
                    onClose={() => setCreating(false)}
                    onCreate={() => console.log('create')}
                    alwaysShowInput
                />
            )}
        </Fragment>
    );
};

export default Checklists;
