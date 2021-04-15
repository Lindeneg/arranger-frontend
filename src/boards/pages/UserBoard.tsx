import React, { FC, Fragment, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import BoardItem from '../components/BoardItem';
import { Spinner, ErrorModal } from '../../common/components';
import { RootState } from '../../store';
import { clearBoardError } from '../../store/actions';
import { BoardPayload } from '../../store/boards/types';

const UserBoard: FC = () => {
    const dispatch = useDispatch();
    const { boardId } = useParams<{ boardId: string }>();
    const { board, requesting, error } = useSelector((state: RootState) => state.board);

    useEffect(() => {
        if (board === null) {
            //dispatch(getBoard(boardId));
            console.log(boardId);
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
        dispatch(clearBoardError);
    };

    return (
        <Fragment>
            <ErrorModal show={!!error} onClose={clearError} errorMessage={error} />
            {requesting && <Spinner absoluteCentered />}
            {board !== null && (
                <BoardItem board={board} onUpdate={onBoardUpdate} onDelete={onBoardDelete} />
            )}
        </Fragment>
    );
};

export default UserBoard;
