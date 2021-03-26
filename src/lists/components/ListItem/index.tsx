import { Fragment, useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';

import Cards from '../../../cards/components/Cards';
import Card from '../../../common/components/Interface/Card';
import ListModal from '../ListModal';
import {
    BaseProps,
    CardResponse,
    DropType,
    Functional,
    ListResponse,
    ListUpdatable,
    OptCls
} from '../../../common/util';
import classes from './ListItem.module.css';

interface ListItemProps extends BaseProps, OptCls, ListUpdatable, ListResponse<CardResponse<string[]>[]> {
    index: number;
    boardId: string;
}

/**
 * Draggable List components. Allows update/deletion of List. Wraps all child Cards.
 */

const ListItem: Functional<ListItemProps> = (props) => {
    const [updating, setUpdating] = useState<boolean>(false);

    const onUpdateAcceptHandler = (): void => {
        setUpdating(true);
    };

    const onUpdateCancelHandler = (): void => {
        setUpdating(false);
    };

    return (
        <Fragment>
            <ListModal
                show={updating}
                onClick={onUpdateCancelHandler}
                owningBoardId={props.boardId}
                update={{
                    name: props.name,
                    id: props._id
                }}
            />
            <Draggable draggableId={props._id} index={props.index}>
                {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <li style={{ height: '100%' }}>
                            <Droppable droppableId={props._id} type={DropType.Card}>
                                {(dropProp) => (
                                    <div
                                        {...dropProp.droppableProps}
                                        ref={dropProp.innerRef}
                                        style={{ height: '100%' }}
                                    >
                                        <Card className={classes.Item}>
                                            <div className={classes.Header}>
                                                <h3>{props.name}</h3>
                                                <div onClick={onUpdateAcceptHandler}>&#9776;</div>
                                            </div>
                                            <hr style={{ marginTop: '0', border: '1px solid rgb(99, 99, 99)' }} />
                                            <Cards
                                                updateLists={props.updateLists}
                                                listOwnerId={props._id}
                                                cards={props.cards}
                                                order={props.order}
                                            />
                                        </Card>
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

export default ListItem;
