import { Fragment, useState } from 'react';

import Cards from '../../../cards/components/Cards';
import Card from '../../../common/components/Interface/Card';
import ListModal from '../ListModal';
import { BaseProps, CardResponse, Functional, ListResponse, OptCls, Draggable } from '../../../common/util';
import classes from './ListItem.module.css';

interface ListItemProps extends BaseProps, OptCls, Draggable<HTMLLIElement>, ListResponse<CardResponse<string[]>[]> {
    boardColor: string;
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
                boardColor={props.boardColor}
                update={{
                    name: props.name,
                    id: props._id
                }}
            />
            <li style={props.style} id={props._id} onDragOver={props.onDragOver} onDragEnd={props.onDragEnd} draggable>
                <Card className={classes.Item}>
                    <div className={classes.Header}>
                        <h3>{props.name}</h3>
                        <div onClick={onUpdateAcceptHandler}>&#9776;</div>
                    </div>
                    <hr style={{ marginTop: '0', border: '1px solid rgb(99, 99, 99)' }} />
                    <Cards listOwnerId={props._id} cards={props.cards} />
                </Card>
            </li>
        </Fragment>
    );
};

export default ListItem;
