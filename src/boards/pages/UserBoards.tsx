import React, { FC, useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import BoardList from '../components/BoardList';
import { RootState } from '../../store';
import { getBoards, clearBoardError } from '../../store/actions';
import { Spinner, ErrorModal } from '../../common/components';

const UserBoards: FC = () => {
    const dispatch = useDispatch();
    const { boards, requesting, requested, error } = useSelector((state: RootState) => state.board);

    useEffect(() => {
        if (boards === null) {
            dispatch(getBoards());
        }
    }, [boards, dispatch]);

    const onBoardCreate = (): void => {};

    const onBoardDelete = (): void => {};

    const onBoardUpdate = (): void => {};

    const clearError = (): void => {
        dispatch(clearBoardError());
    };

    return (
        <Fragment>
            <ErrorModal show={!!error} onClose={clearError} errorMessage={error} />
            {requesting && <Spinner absoluteCentered />}
            {requested && !!boards && (
                <BoardList boards={boards} onCreate={onBoardCreate} onDelete={onBoardDelete} onUpdate={onBoardUpdate} />
            )}
        </Fragment>
    );
};

export default UserBoards;
