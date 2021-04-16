import React, { FC, useState } from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { PencilSquare, Trash } from 'react-bootstrap-icons';

import { CreationInput } from '../../common/components';
import { ColorOption, ThemeOption, themeToHex } from '../../common';

interface BoardHeaderProps {
    onUpdate: (name: string, color: ColorOption) => void;
    onDelete: () => void;
    colorText: ThemeOption;
    name: string;
    color: ColorOption;
}

const BoardHeader: FC<BoardHeaderProps> = (props) => {
    const [editing, setEditing] = useState<boolean>(false);
    return (
        <div className="mt-4">
            {!editing && (
                <>
                    <OverlayTrigger
                        placement="bottom"
                        overlay={<Tooltip id="tooltip-bottom">delete</Tooltip>}
                    >
                        <Trash
                            className="float-right mr-2"
                            role="button"
                            size="30"
                            onClick={props.onDelete}
                        />
                    </OverlayTrigger>
                    <div
                        style={{
                            borderRight: `0.2em solid ${themeToHex(props.colorText)}`,
                            height: '2em',
                            float: 'right',
                            marginRight: '0.5rem'
                        }}
                    ></div>
                </>
            )}
            {editing && (
                <CreationInput
                    type="board"
                    inputMaxLength={16}
                    customColor={props.colorText}
                    placeholder="Board name"
                    inputValue={props.name}
                    chosenColor={props.color}
                    style={{ width: '100%' }}
                    onClose={setEditing.bind(null, false)}
                    onCreate={props.onUpdate}
                    alwaysShowInput={true}
                    color
                />
            )}
            {!editing && (
                <>
                    <OverlayTrigger
                        placement="bottom"
                        overlay={<Tooltip id="tooltip-bottom">edit</Tooltip>}
                    >
                        <PencilSquare
                            className="float-right mr-2"
                            role="button"
                            size="30"
                            onClick={setEditing.bind(null, true)}
                        />
                    </OverlayTrigger>
                    <p className="h2">{props.name}</p>
                </>
            )}
        </div>
    );
};

export default BoardHeader;
