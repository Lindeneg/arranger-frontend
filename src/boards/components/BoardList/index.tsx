import { Fragment, useState } from 'react';

import BoardListItem from './BoardListItem';
import BoardModal from '../BoardModal';
import Card from '../../../common/components/Interface/Card';
import Button from '../../../common/components/Interactable/Button';
import { BaseProps, BoardResponse, Functional } from '../../../common/util';
import classes from './BoardList.module.css';

interface BoardListProps extends BaseProps {
    boards: BoardResponse<string[], string[], string[]>[];
}

/**
 * Component with list of Boards that also allows creation of board.
 */

const BoardList: Functional<BoardListProps> = (props) => {
    const [showModal, setShowModal] = useState<boolean>(false);

    const onOpenModal = () => {
        setShowModal(true);
    };

    const onCloseModal = () => {
        setShowModal(false);
    };

    return (
        <Fragment>
            <BoardModal show={showModal} onClose={onCloseModal} />
            {props.boards.length <= 0 ? (
                <div className={[classes.List, 'center'].join(' ')}>
                    <Card style={{ position: 'absolute', bottom: '50%' }}>
                        <h2>No boards found. Go ahead and create one!</h2>
                        <Button onClick={onOpenModal}>Create Board</Button>
                    </Card>
                </div>
            ) : (
                <Fragment>
                <ul className={classes.List}>
                    {props.boards.map((board) => (
                        <BoardListItem {...board} key={board._id} />
                    ))}
                </ul>
                <Button inverse onClick={onOpenModal} style={{width: '100%', marginRight: '0'}}>NEW BOARD</Button>
                </Fragment>
            )}
        </Fragment>
    );
};

export default BoardList;
