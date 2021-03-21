import { Fragment, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { useHttp, useDragDrop } from '../../common/hooks';
import { AuthContext } from '../../common/context';
import ListItem from './ListItem';
import ListModal from './ListModal';
import Card from '../../common/components/Interface/Card';
import Button from '../../common/components/Interactable/Button';
import ErrorModal from '../../common/components/Interface/Modal/ErrorModal';
import { BaseProps, Functional } from '../../common/util';
import { BoardResponse, CardResponse, ListResponse, DragType, getURL, devLog } from '../../common/util';
import classes from './Lists.module.css';

interface ListsProps extends BaseProps {
    lists: ListResponse<CardResponse<string[]>[]>[];
    boardColor: string;
    boardName: string;
    boardId: string;
    order: string[];
}

/**
 * List component. Acts as a wrapper for child Cards and as a drop-target for DragType List.
 */

const Lists: Functional<ListsProps> = (props) => {
    const history = useHistory();
    const authContext = useContext(AuthContext);
    const { error, clearError, sendRequest } = useHttp<BoardResponse<string[]>>();
    const [creating, setCreating] = useState<boolean>(false);
    const { onDragOver, onDragEnd, currentDes } = useDragDrop<HTMLLIElement>(
        DragType.ListToList,
        props.order,
        async (order: string[]) => {
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
        }
    );

    const onCreateHandler = (): void => {
        setCreating(true);
    };

    const onCancelCreateHandler = (): void => {
        setCreating(false);
    };

    return (
        <Fragment>
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
                <ul className={classes.List}>
                    {props.order.map((orderId) => {
                        const list = props.lists.find((e) => e._id === orderId);
                        if (list) {
                            return (
                                <ListItem
                                    {...list}
                                    key={list._id}
                                    boardColor={props.boardColor}
                                    boardId={props.boardId}
                                    onDragOver={onDragOver}
                                    onDragEnd={onDragEnd}
                                    style={{ opacity: currentDes === list._id ? 0.2 : 1 }}
                                />
                            );
                        } else {
                            return null;
                        }
                    })}
                </ul>
            )}
        </Fragment>
    );
};

export default Lists;
