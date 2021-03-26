import { Fragment, useState, useContext } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';

import { DragEndCallbackResult, onDragEndCallback } from '../util/onDragEndCallback';
import { useHttp } from '../../common/hooks';
import { AuthContext, ThemeContext } from '../../common/context';
import ListItem from './ListItem';
import ListModal from './ListModal';
import Card from '../../common/components/Interface/Card';
import Button from '../../common/components/Interactable/Button';
import ErrorModal from '../../common/components/Interface/Modal/ErrorModal';
import { BaseProps, ChecklistResponse, DropType, Functional, IList, ListUpdatable, Orderable } from '../../common/util';
import { BoardResponse, CardResponse, ListResponse, devLog } from '../../common/util';
import classes from './Lists.module.css';

interface ListsProps extends BaseProps, Orderable, ListUpdatable {
    lists: IList[];
    boardName: string;
    boardId: string;
    setOrder: (order: string[]) => void;
}

type Responses =
    | BoardResponse<string[]>
    | ListResponse<CardResponse<string[]>[]>
    | CardResponse<ChecklistResponse[]>
    | ChecklistResponse;

/**
 * List component. Acts as a wrapper for child Cards and as a drop-target for a draggable List.
 */

const Lists: Functional<ListsProps> = (props) => {
    const authContext = useContext(AuthContext);
    const theme = useContext(ThemeContext);
    const { error, clearError, sendRequest } = useHttp<Responses>();
    const [creating, setCreating] = useState<boolean>(false);
    const boardColor = theme.color;

    const updateOrderHandler = async (url: string, body: string) => {
        try {
            await sendRequest(url, 'PATCH', body, {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + authContext.token
            });
        } catch (err) {
            devLog(err);
        }
    };

    const onDragEnd = (result: DropResult): void => {
        const dragResult: DragEndCallbackResult = onDragEndCallback(result, props.order, props.lists, {
            id: props.boardId,
            name: props.boardName,
            color: boardColor
        });
        if (dragResult.http.url !== null && dragResult.http.body !== null) {
            props.setOrder(dragResult.newOrder);
            props.updateLists(() => dragResult.newLists);
            updateOrderHandler(dragResult.http.url, dragResult.http.body);
        }
    };

    const onCreateHandler = (): void => {
        setCreating(true);
    };

    const onCancelCreateHandler = (): void => {
        setCreating(false);
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <ErrorModal show={!!error} error={error} onClear={clearError} />
            <ListModal
                order={props.order}
                setOrder={props.setOrder}
                updateLists={props.updateLists}
                show={creating}
                onClick={onCancelCreateHandler}
                owningBoardId={props.boardId}
            />
            {props.lists.length <= 0 ? (
                <div className="center">
                    {!creating && (
                        <Card style={{ marginTop: '2rem', backgroundColor: boardColor }}>
                            <h2>No lists found. Go ahead and create one!</h2>
                            <Button onClick={onCreateHandler}>Create List</Button>
                        </Card>
                    )}
                </div>
            ) : (
                <Droppable direction="horizontal" droppableId={props.boardId} type={DropType.List}>
                    {(provided) => (
                        <Fragment>
                            <ul {...provided.droppableProps} ref={provided.innerRef} className={classes.List}>
                                {props.order.map((orderId, index) => {
                                    const list = props.lists.find((e) => e._id === orderId);
                                    if (list) {
                                        return (
                                            <ListItem
                                                {...list}
                                                listOrder={props.order}
                                                setOrder={props.setOrder}
                                                updateLists={props.updateLists}
                                                index={index}
                                                key={list._id}
                                                boardId={props.boardId}
                                            />
                                        );
                                    } else {
                                        return null;
                                    }
                                })}
                            </ul>
                            {provided.placeholder}
                        </Fragment>
                    )}
                </Droppable>
            )}
        </DragDropContext>
    );
};

export default Lists;
