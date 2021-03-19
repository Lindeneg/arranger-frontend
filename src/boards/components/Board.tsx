import { Fragment, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { useHttp } from '../../common/hooks';
import { AuthContext } from '../../common/context';
import BoardModal from './BoardModal';
import Lists from '../../lists/components/Lists';
import ErrorModal from '../../common/components/Interface/Modal/ErrorModal';
import Spinner from '../../common/components/Interface/Spinner';
import Card from '../../common/components/Interface/Card';
import Button from '../../common/components/Interactable/Button';
import { BoardResponse } from '../pages/UserBoard';
import { BaseProps, devLog, Functional, DeleteResponse, getURL } from '../../common/util';
import classes from './Board.module.css';

interface BoardProps extends BaseProps {
    board: BoardResponse;
}

const Board: Functional<BoardProps> = (props) => {
    const history = useHistory();
    const authContext = useContext(AuthContext);
    const { isLoading, error, clearError, sendRequest } = useHttp<DeleteResponse>();
    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);

    const onDeleteHandler = async () => {
        if (confirmDelete) {
            try {
                const res: DeleteResponse | void = await sendRequest(
                    getURL('boards/' + props.board._id),
                    'DELETE',
                    null,
                    { Authorization: 'Bearer ' + authContext.token }
                );
                res && history.push('/boards');
            } catch (err) {
                devLog(err);
            }
        } else {
            devLog('warning: trying to delete board without user confirmation');
        }
    };

    const onConfirmAccept = (): void => {
        setConfirmDelete(true);
    };

    const onConfirmDeny = (): void => {
        setConfirmDelete(false);
    };

    const onModelOpen = (): void => {
        setShowModal(true);
    };

    const onModelClose = (): void => {
        setShowModal(false);
    };

    return (
        <Fragment>
            <BoardModal
                show={showModal}
                onClose={onModelClose}
                update={{
                    id: props.board._id,
                    name: props.board.name,
                    color: props.board.color
                }}
            />
            <ErrorModal show={!!error} error={error} onClear={clearError} />
            {isLoading && (
                <div className="center">
                    <Spinner asOverlay />
                </div>
            )}
            {!isLoading && (
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
                                    <Button type="button" onClick={onDeleteHandler} inverse>
                                        YES
                                    </Button>
                                    <Button type="button" onClick={onConfirmDeny}>
                                        NO
                                    </Button>
                                </Fragment>
                            ) : (
                                <Fragment>
                                    <Button type="button" onClick={onModelOpen} inverse>
                                        UPDATE BOARD
                                    </Button>
                                    <Button type="button" onClick={onConfirmAccept} inverse>
                                        DELETE BOARD
                                    </Button>
                                </Fragment>
                            )}
                        </div>
                        <hr />
                        <Lists lists={props.board.lists} boardColor={props.board.color} boardId={props.board._id} />
                    </div>
                </Card>
            )}
        </Fragment>
    );
};

export default Board;
