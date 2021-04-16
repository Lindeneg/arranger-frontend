import React, { FC, Fragment, useState } from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { PencilSquare, Trash } from 'react-bootstrap-icons';

import { CreationInput, ConfirmModal } from '../../common/components';
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
    const [deleting, setDeleting] = useState<boolean>(false);

    const onEditAccept = (): void => {
        setEditing(true);
    };

    const onEditDeny = (): void => {
        setEditing(false);
    };

    const onDeleteAccept = (): void => {
        setDeleting(true);
    };

    const onDeleteDeny = (): void => {
        setDeleting(false);
    };

    return (
        <Fragment>
            <ConfirmModal
                show={deleting}
                onConfirm={props.onDelete}
                onClose={onDeleteDeny}
                headerTxt="Confirm Board Deletion"
            />
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
                                onClick={onDeleteAccept}
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
                        onClose={onEditDeny}
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
                                onClick={onEditAccept}
                            />
                        </OverlayTrigger>
                        <p className="h2">{props.name}</p>
                    </>
                )}
            </div>
        </Fragment>
    );
};

export default BoardHeader;
