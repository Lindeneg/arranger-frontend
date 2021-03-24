import { Fragment, useState, useContext } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';

import { useHttp } from '../../common/hooks';
import { AuthContext, ThemeContext } from '../../common/context';
import ListItem from './ListItem';
import ListModal from './ListModal';
import Card from '../../common/components/Interface/Card';
import Button from '../../common/components/Interactable/Button';
import ErrorModal from '../../common/components/Interface/Modal/ErrorModal';
import { BaseProps, ChecklistResponse, DropType, Functional, Orderable } from '../../common/util';
import { BoardResponse, CardResponse, ListResponse, getURL, devLog } from '../../common/util';
import classes from './Lists.module.css';

type ILists = ListResponse<CardResponse<string[]>[]>[];

interface ListsProps extends BaseProps, Orderable {
    lists: ILists;
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
    const [lists, setLists] = useState<ILists>(props.lists);
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
        let url: string | null = null;
        let body: string | null = null;
        if (result.destination) {
            switch (result.type) {
                case DropType.List:
                    if (result.destination.index !== result.source.index) {
                        const newOrder = [...props.order];
                        const [src] = newOrder.splice(result.source.index, 1);
                        newOrder.splice(result.destination.index, 0, src);
                        url = getURL(`boards/${props.boardId}`);
                        body = JSON.stringify({
                            name: props.boardName,
                            color: boardColor,
                            order: newOrder
                        });
                        props.setOrder(newOrder);
                    }
                    break;
                case DropType.Card:
                    if (
                        result.source.droppableId === result.destination?.droppableId &&
                        result.source.index === result.destination.index
                    ) {
                        return;
                    }
                    const newLists = [...lists];
                    const srcList = newLists.find((e) => e._id === result.source.droppableId);
                    const desList = newLists.find((e) => e._id === result.destination?.droppableId);
                    if (typeof srcList !== 'undefined' && typeof desList !== 'undefined') {
                        const newSrcOrder = [...srcList.order];
                        const newDestOrder = [...desList.order];
                        const card = srcList.cards.find((e) => e._id === result.draggableId);
                        console.log(card);
                        if (card) {
                            const targetOrder = srcList._id === desList._id ? newSrcOrder : newDestOrder;
                            const [target] = newSrcOrder.splice(result.source.index, 1);
                            if (result.destination.index < targetOrder.length && targetOrder.length > 0) {
                                targetOrder.splice(result.destination.index, 0, target);
                            } else {
                                targetOrder.push(target);
                            }
                            srcList.order = newSrcOrder;
                            if (srcList._id !== desList._id) {
                                desList.order = newDestOrder;
                                srcList.cards = srcList.cards.filter((e) => e._id !== card._id);
                                card.owner = desList._id;
                                desList.cards.push(card);
                            }   
                            url = getURL('lists/update/card/order');
                            body = JSON.stringify({
                                srcListId: srcList._id,
                                srcListOrder: newSrcOrder,
                                desListId: desList._id,
                                desListOrder: newDestOrder,
                                cardId: card._id
                            });
                            setLists(newLists);
                        }
                    }
                    break;
                case DropType.Checklist:
                    break;
                default:
                    break;
            }
            if (url !== null && body !== null) {
                updateOrderHandler(url, body);
            }
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
            <ListModal show={creating} onClick={onCancelCreateHandler} owningBoardId={props.boardId} />
            {lists.length <= 0 ? (
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
                                    const list = lists.find((e) => e._id === orderId);
                                    if (list) {
                                        return (
                                            <ListItem {...list} index={index} key={list._id} boardId={props.boardId} />
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
