import { Fragment, useState } from 'react';

import Lists from '../../lists/components/Lists';
import Card from '../../common/components/Interface/Card';
import Button from '../../common/components/Interactable/Button';
import { BaseProps, Functional } from '../../common/util';
import { BoardResponse } from '../pages/UserBoard';
import classes from './Board.module.css';

interface BoardProps extends BaseProps {
    board: BoardResponse;
}

const Board: Functional<BoardProps> = (props) => {
    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

    const onDeleteHandler = (): void => {
        if (confirmDelete) {
            console.log('deleting board');
        }
    };

    const onConfirmAccept = (): void => {
        setConfirmDelete(true);
    };

    const onConfirmDeny = (): void => {
        setConfirmDelete(false);
    };

    const onUpdateBoardModalOpen = (): void => {
        console.log('updating board');
    };

    return (
        <Card
            style={{
                backgroundColor: props.board.color
            }}
            className={classes.Card}
        >
            <div className={classes.Board}>
                <h2>{confirmDelete ? 'ARE YOU SURE?' : props.board.name.toUpperCase()}</h2>
                <div className={classes.BtnCon}>
                    {confirmDelete ? (
                        <Fragment>
                            <Button onClick={onDeleteHandler} danger>
                                CONFIRM
                            </Button>
                            <Button onClick={onConfirmDeny}>CANCEL</Button>
                        </Fragment>
                    ) : (
                        <Fragment>
                            <Button onClick={onUpdateBoardModalOpen} inverse>
                                UPDATE BOARD
                            </Button>
                            <Button onClick={onConfirmAccept} inverse>
                                DELETE BOARD
                            </Button>
                        </Fragment>
                    )}
                </div>
                <hr />
                <Lists />
            </div>
        </Card>
    );
};

export default Board;
