import { Fragment, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';

import { useHttp } from '../../common/hooks';
import { AuthContext } from '../../common/context';
import ListItem from './ListItem';
import ListModal from './ListModal';
import Card from '../../common/components/Interface/Card';
import Button from '../../common/components/Interactable/Button';
import ErrorModal from '../../common/components/Interface/Modal/ErrorModal';
import { BaseProps, Functional } from '../../common/util';
import { BoardResponse, CardResponse, ListResponse, getURL, devLog } from '../../common/util';
import classes from './Lists.module.css';

interface ListsProps extends BaseProps {
    lists: ListResponse<CardResponse<string[]>[]>[];
    boardColor: string;
    boardName: string;
    boardId: string;
    order: string[];
}

/**
 * List component. Acts as a wrapper for child Cards and as a drop-target for a draggable List.
 */

const Lists: Functional<ListsProps> = (props) => {
    const history = useHistory();
    const authContext = useContext(AuthContext);
    const { error, clearError, sendRequest } = useHttp<BoardResponse<string[]>>();
    const [creating, setCreating] = useState<boolean>(false);
    const [order, setOrder] = useState<string[]>(props.order);

    const updateOrderHandler = async (order: string[]) => {
        try {
            const res: BoardResponse<string[]> | void = await sendRequest(
                getURL(`boards/${props.boardId}`),
                'PATCH',
                JSON.stringify({
                    name: props.boardName,
                    color: props.boardColor,
                    order
                }),
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + authContext.token
                }
            );
            res && history.go(0);
        } catch (err) {
            devLog(err);
        }
    };

    const onDragEnd = (result: DropResult): void => {
        if (result.destination && result.destination.index !== result.source.index) {
            const newOrder = [...props.order];
            const [src] = newOrder.splice(result.source.index, 1);
            newOrder.splice(result.destination.index, 0, src);
            setOrder(newOrder);
            updateOrderHandler(newOrder);
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
                show={creating}
                onClick={onCancelCreateHandler}
                owningBoardId={props.boardId}
                boardColor={props.boardColor}
            />
            {props.lists.length <= 0 ? (
                <div className="center">
                    {!creating && (
                        <Card style={{ marginTop: '2rem', backgroundColor: props.boardColor }}>
                            <h2>No lists found. Go ahead and create one!</h2>
                            <Button onClick={onCreateHandler}>Create List</Button>
                        </Card>
                    )}
                </div>
            ) : (
                <Droppable direction="horizontal" droppableId="list">
                    {(provided) => (
                        <Fragment>
                            <ul ref={provided.innerRef} className={classes.List} {...provided.droppableProps}>
                                {order.map((orderId, index) => {
                                    const list = props.lists.find((e) => e._id === orderId);
                                    if (list) {
                                        return (
                                            <ListItem
                                                {...list}
                                                index={index}
                                                key={list._id}
                                                boardColor={props.boardColor}
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
