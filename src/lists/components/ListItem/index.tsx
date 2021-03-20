import { Fragment, useState } from 'react';

import Cards from '../../../cards/components/Cards';
import Card from '../../../common/components/Interface/Card';
import ListModal from '../ListModal';
import {
    BaseProps,
    CardResponse,
    DragType,
    Functional,
    ListResponse,
    OptCls,
    DragEventHandler
} from '../../../common/util';
import classes from './ListItem.module.css';

interface ListItemProps extends BaseProps, OptCls, ListResponse<CardResponse<string[]>[]> {
    boardColor: string;
    boardId: string;
    onDragEnd: DragEventHandler<HTMLLIElement>;
    onDragOver: DragEventHandler<HTMLLIElement>;
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
            <li
                draggable-type={DragType.List}
                style={props.style}
                id={props._id}
                draggable
                onDragOver={props.onDragOver}
                onDragEnd={props.onDragEnd}
            >
                <Card className={classes.Item}>
                    <div className={classes.Header}>
                        <h3 onClick={onUpdateAcceptHandler}>{props.name}</h3>
                    </div>
                    <hr style={{ marginTop: '0' }} />
                    <Cards></Cards>
                </Card>
            </li>
        </Fragment>
    );
};

export default ListItem;
