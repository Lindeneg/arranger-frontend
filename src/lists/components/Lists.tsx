import { Fragment, useState } from 'react';

import ListItem from './ListItem';
import ListInteraction from './ListInteraction';
import Card from '../../common/components/Interface/Card';
import Button from '../../common/components/Interactable/Button';
import { BaseProps, Functional } from '../../common/util';
import { CardResponse, ListResponse } from '../../common/util';

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
            {props.lists.length <= 0 ? (
                <div className="center">
                    <Card style={{ marginTop: '2rem', backgroundColor: props.boardColor }}>
                        {!creating ? (
                            <Fragment>
                                <h2>No lists found. Go ahead and create one!</h2>
                                <Button onClick={onCreateHandler}>Create List</Button>
                            </Fragment>
                        ) : (
                            <ListInteraction
                                onClick={onCancelCreateHandler}
                                owningBoardId={props.boardId}
                                boardColor={props.boardColor}
                            />
                        )}
                    </Card>
                    {}
                </div>
            ) : (
                <Fragment>
                    <ul>
                        {props.lists.map((list) => (
                            <ListItem {...list} key={list._id} /* boardColor={props.boardColor} */ />
                        ))}
                    </ul>
                </Fragment>
            )}
        </Fragment>
    );
};

export default Lists;
