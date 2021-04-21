import React, { FC, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import Alert from 'react-bootstrap/Alert';

import List from './List';
import { RootState } from '../../store';
import {
    updateBoardListOrder,
    updateListCardOrder,
    updateList,
    deleteList,
    clearAnyListError
} from '../../store/actions';
import { ThemeOption, DropType, getUpdatedListOrder, getUpdatedCardOrder } from '../../common';
import { ErrorModal, Hr } from '../../common/components';
import classes from './Lists.module.css';

interface ListsProps {
    owner: string;
    colorText: ThemeOption;
}

const Lists: FC<ListsProps> = (props) => {
    const dispatch = useDispatch();
    const { lists, error } = useSelector((state: RootState) => state.list);
    const { board } = useSelector((state: RootState) => state.board);

    const onUpdateList = useCallback(
        (id: string, name: string): void => {
            dispatch(updateList(id, { name }));
        },
        [dispatch]
    );

    const onDeleteList = useCallback(
        (id: string): void => {
            dispatch(deleteList(id));
        },
        [dispatch]
    );

    const clearError = (): void => {
        dispatch(clearAnyListError());
    };

    const onDragEnd = (result: DropResult): void => {
        if (board) {
            switch (result.type) {
                case DropType.List:
                    if (result.destination && result.destination.index !== result.source.index) {
                        dispatch(
                            updateBoardListOrder(
                                props.owner,
                                result.source.index,
                                result.destination.index,
                                getUpdatedListOrder(
                                    [...board.listOrder],
                                    result.source.index,
                                    result.destination.index
                                )
                            )
                        );
                    }
                    break;
                case DropType.Card:
                    if (
                        (result.source.droppableId === result.destination?.droppableId &&
                            result.source.index === result.destination.index) ||
                        typeof result.destination === 'undefined' ||
                        result.destination === null
                    ) {
                        break;
                    }
                    dispatch(
                        updateListCardOrder(
                            result.source.index,
                            result.destination.index,
                            getUpdatedCardOrder(
                                [...lists],
                                result.draggableId,
                                result.source.droppableId,
                                result.source.index,
                                result.destination.droppableId,
                                result.destination.index
                            )
                        )
                    );
                    break;
                case DropType.Checklist:
                    console.log(result);
                    break;
                default:
                    break;
            }
        }
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <ErrorModal show={!!error} errorMessage={error} onClose={clearError} />
            <Hr colorText={props.colorText} />
            {lists.length > 0 && board ? (
                <Droppable direction="horizontal" droppableId={props.owner} type={DropType.List}>
                    {(provided) => (
                        <>
                            <ul
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className={classes.List}
                            >
                                {board.listOrder.map((id, index) => {
                                    const list = lists.find((l) => l._id === id);
                                    if (list) {
                                        return (
                                            <List
                                                key={list._id}
                                                index={index}
                                                id={list._id}
                                                name={list.name}
                                                colorText={props.colorText}
                                                cards={list.cards}
                                                cardOrder={list.cardOrder}
                                                onUpdate={onUpdateList}
                                                onDelete={onDeleteList}
                                            />
                                        );
                                    }
                                    return null;
                                })}
                            </ul>
                            {provided.placeholder}
                        </>
                    )}
                </Droppable>
            ) : (
                <Alert variant="info">
                    No lists found. Go ahead and create one by clicking the plus icon in the
                    right-corner.
                </Alert>
            )}
        </DragDropContext>
    );
};

export default Lists;
