import { Fragment, useState } from 'react';

import ListItem from './ListItem';
import ListInteraction from './ListInteraction';
import Card from '../../common/components/Interface/Card';
import Button from '../../common/components/Interactable/Button';
import { BaseProps, Functional } from '../../common/util';
import { CardResponse, ListResponse } from '../../common/util';
import classes from './Lists.module.css';

interface ListsProps extends BaseProps {
    lists: ListResponse<CardResponse<string[]>[]>[];
    boardColor: string;
    boardId: string;
}

/**
 * Component with list of Boards that also allows creation of board.
 */

const Lists: Functional<ListsProps> = (props) => {
    const [creating, setCreating] = useState<boolean>(false);

    const onCreateHandler = (): void => {
        setCreating(true);
    };

    const onCancelCreateHandler = (): void => {
        setCreating(false);
    };

    return (
        <Fragment>
            <ListInteraction
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
                <Fragment>
                    <ul className={classes.List}>
                        {props.lists.map((list) => (
                            <li key={list._id}>
                                <ListItem {...list} boardColor={props.boardColor} />
                            </li>
                        ))}
                    </ul>
                </Fragment>
            )}
        </Fragment>
    );
};

export default Lists;
