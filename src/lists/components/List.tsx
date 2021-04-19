import React, { FC, Fragment, useState, useCallback } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { Trash } from 'react-bootstrap-icons';

import Cards from '../../cards/components/Cards';
import { ThemeOption, DropType, getCls } from '../../common';
import { Card } from '../../store/cards/types';
import { CreationInput, ConfirmModal } from '../../common/components';
import classes from './Lists.module.css';

interface ListProps {
    id: string;
    name: string;
    index: number;
    cards: Card[];
    cardOrder: string[];
    colorText: ThemeOption;
    onUpdate: (id: string, name: string) => void;
    onDelete: (id: string) => void;
}

const List: FC<ListProps> = (props) => {
    const [deleting, setDeleting] = useState<boolean>(false);
    const [editing, setEditing] = useState<boolean>(false);

    const { onUpdate, id, name } = props;

    const onListUpdate = useCallback(
        (newName: string): void => {
            if (newName !== name) {
                onUpdate(id, newName);
            }
        },
        [onUpdate, id, name]
    );

    return (
        <Fragment>
            <ConfirmModal
                show={deleting}
                onClose={() => setDeleting(false)}
                onConfirm={props.onDelete.bind(null, props.id)}
                headerTxt="Confirm List Deletion"
            />
            <Draggable draggableId={props.id} index={props.index}>
                {(provided) => (
                    <div
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                    >
                        <li style={{ height: '100%' }}>
                            <Droppable droppableId={props.id} type={DropType.Card}>
                                {(dropProp) => (
                                    <div
                                        {...dropProp.droppableProps}
                                        ref={dropProp.innerRef}
                                        style={{ height: '100%' }}
                                    >
                                        <div
                                            className={getCls(
                                                classes.Item,
                                                classes.Wrapper,
                                                'text-' + props.colorText
                                            )}
                                        >
                                            <div className={classes.Header}>
                                                {editing ? (
                                                    <CreationInput
                                                        type="list"
                                                        inputMaxLength={16}
                                                        customColor={props.colorText}
                                                        placeholder="List name"
                                                        inputValue={props.name}
                                                        onClose={() => setEditing(false)}
                                                        onCreate={onListUpdate}
                                                        alwaysShowInput={true}
                                                    />
                                                ) : (
                                                    <Fragment>
                                                        <h3
                                                            onClick={() => setEditing(true)}
                                                            className={classes.Name}
                                                        >
                                                            {props.name}
                                                        </h3>
                                                        <Trash
                                                            role="button"
                                                            size="20"
                                                            onClick={() => setDeleting(true)}
                                                        />
                                                    </Fragment>
                                                )}
                                            </div>
                                            <hr
                                                style={{
                                                    marginTop: '0',
                                                    border: '1px solid rgb(99, 99, 99)'
                                                }}
                                            />
                                            <Cards
                                                owner={props.id}
                                                cards={props.cards}
                                                cardOrder={props.cardOrder}
                                                colorText={props.colorText}
                                            />
                                        </div>
                                        {dropProp.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </li>
                    </div>
                )}
            </Draggable>
        </Fragment>
    );
};

export default List;
