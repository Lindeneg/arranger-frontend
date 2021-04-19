import React, { FC, Fragment, useState, useCallback } from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { PlusCircle, PencilSquare, Trash } from 'react-bootstrap-icons';

import { CreationInput, ConfirmModal } from '../../common/components';
import { ColorOption, ThemeOption, themeToHex } from '../../common';

interface BoardHeaderProps {
    onCreateList: (name: string) => void;
    onUpdate: (name: string, color: ColorOption) => void;
    onDelete: () => void;
    colorText: ThemeOption;
    name: string;
    color: ColorOption;
}

const BoardHeader: FC<BoardHeaderProps> = (props) => {
    const [editing, setEditing] = useState<boolean>(false);
    const [creating, setCreating] = useState<boolean>(false);
    const [deleting, setDeleting] = useState<boolean>(false);

    const { onUpdate, onCreateList, color } = props;

    const onBoardUpdate = useCallback(
        (name: string, chosenColor?: ColorOption): void => {
            if (editing) {
                onUpdate(name, chosenColor || color);
            } else if (creating) {
                onCreateList(name);
            }
        },
        [onUpdate, onCreateList, color, editing, creating]
    );

    const onEditAccept = (): void => {
        setEditing(true);
    };

    const onEditDeny = (): void => {
        setEditing(false);
    };

    const onCreateAccept = (): void => {
        setCreating(true);
    };

    const onCreateDeny = (): void => {
        setCreating(false);
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
                {!editing && !creating && (
                    <>
                        <OverlayTrigger
                            placement="bottom"
                            overlay={<Tooltip id="tooltip-bottom">delete board</Tooltip>}
                        >
                            <Trash
                                className="float-right mr-3"
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
                                marginRight: '1rem'
                            }}
                        ></div>
                    </>
                )}
                {(editing || creating) && (
                    <CreationInput
                        type={editing ? 'board' : 'list'}
                        inputMaxLength={16}
                        customColor={props.colorText}
                        placeholder={(editing ? 'Board' : 'List') + ' name'}
                        inputValue={editing ? props.name : ''}
                        chosenColor={props.color}
                        style={{ width: '100%', textAlign: 'center' }}
                        onClose={editing ? onEditDeny : onCreateDeny}
                        onCreate={onBoardUpdate}
                        alwaysShowInput={true}
                        color={editing}
                    />
                )}
                {!editing && !creating && (
                    <>
                        <OverlayTrigger
                            placement="bottom"
                            overlay={<Tooltip id="tooltip-bottom">edit board</Tooltip>}
                        >
                            <PencilSquare
                                className="float-right mr-3"
                                role="button"
                                size="30"
                                onClick={onEditAccept}
                            />
                        </OverlayTrigger>
                        <div
                            style={{
                                borderRight: `0.2em solid ${themeToHex(props.colorText)}`,
                                height: '2em',
                                float: 'right',
                                marginRight: '1rem'
                            }}
                        ></div>
                        <OverlayTrigger
                            placement="bottom"
                            overlay={<Tooltip id="tooltip-bottom">add list</Tooltip>}
                        >
                            <PlusCircle
                                className="float-right mr-3"
                                role="button"
                                size="30"
                                onClick={onCreateAccept}
                            />
                        </OverlayTrigger>
                        <p className="h2 ml-1">{props.name}</p>
                    </>
                )}
            </div>
        </Fragment>
    );
};

export default BoardHeader;
