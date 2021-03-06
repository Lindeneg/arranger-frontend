import React, { FC, Fragment, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import BoardList from '../components/BoardList';
import { RootState } from '../../store';
import { getBoards, createBoard, clearBoardError } from '../../store/actions';
import { Spinner, ErrorModal } from '../../common/components';
import { BoardPayload } from '../../store/boards/types';

const UserBoards: FC = () => {
    const dispatch = useDispatch();
    const { boards, requesting, requested, error } = useSelector((state: RootState) => state.board);
    const { userId } = useSelector((state: RootState) => state.user);

    useEffect(() => {
        if (boards === null && userId !== null) {
            dispatch(getBoards(userId));
        }
    }, [boards, userId, dispatch]);

    const onBoardCreate = useCallback(
        (payload: BoardPayload<'name' | 'color'>): void => {
            dispatch(createBoard(payload));
        },
        [dispatch]
    );

    const clearError = (): void => {
        dispatch(clearBoardError());
    };

    return (
        <Fragment>
            <ErrorModal show={!!error} onClose={clearError} errorMessage={error} />
            {requesting && <Spinner absoluteCentered />}
            {requested && !!boards && <BoardList boards={boards} onCreate={onBoardCreate} />}
        </Fragment>
    );
};

export default UserBoards;
