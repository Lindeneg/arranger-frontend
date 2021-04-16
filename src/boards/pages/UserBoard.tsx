import React, { FC, Fragment, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import Board from '../components/Board';
import { Spinner, ErrorModal } from '../../common/components';
import { RootState } from '../../store';
import { getBoard, clearBoardError } from '../../store/actions';
import { BoardPayload } from '../../store/boards/types';

const UserBoard: FC = () => {
    const dispatch = useDispatch();
    const { boardId } = useParams<{ boardId: string }>();
    const { board, requested, requesting, error } = useSelector((state: RootState) => state.board);

    useEffect(() => {
        if (board === null) {
            dispatch(getBoard(boardId));
        }
    }, [boardId, board, dispatch]);

    const onBoardUpdate = (
        payload: BoardPayload<'name' | 'color' | 'lists' | 'listOrder'>
    ): void => {
        //dispatch(createBoard(payload));
        console.log('update ' + boardId, payload);
    };

    const onBoardDelete = (): void => {
        console.log('delete ' + boardId);
    };

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
