import React, { FC, Fragment, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';

import Board from '../components/Board';
import { Spinner, ErrorModal } from '../../common/components';
import { RootState } from '../../store';
import { getBoard, deleteBoard, updateBoard, clearBoardError } from '../../store/actions';
import { BoardPayload } from '../../store/boards/types';

const UserBoard: FC = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { boardId } = useParams<{ boardId: string }>();
    const { board, requested, requesting, error } = useSelector((state: RootState) => state.board);

    useEffect(() => {
        if (board === null) {
            dispatch(getBoard(boardId));
        }
    }, [boardId, board, dispatch]);

    const onBoardUpdate = useCallback(
        (payload: BoardPayload<'name' | 'color' | 'listOrder'>): void => {
            dispatch(updateBoard(boardId, payload));
        },
        [dispatch, boardId]
    );

    const onBoardDelete = useCallback((): void => {
        dispatch(deleteBoard(boardId));
        history.push('/boards');
    }, [dispatch, boardId, history]);

    const clearError = (): void => {
        dispatch(clearBoardError());
    };

    return (
        <Fragment>
            <ErrorModal show={error !== null} onClose={clearError} errorMessage={error} />
            {requesting && <Spinner absoluteCentered />}
            {requested && !!board && (
                <Board board={board} onUpdate={onBoardUpdate} onDelete={onBoardDelete} />
            )}
        </Fragment>
    );
};

export default UserBoard;
