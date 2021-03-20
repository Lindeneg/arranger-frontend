import { useState, useEffect, useContext, Fragment } from 'react';
import { useParams } from 'react-router-dom';

import Board from '../../components/Board';
import { useHttp } from '../../../common/hooks';
import { AuthContext, ThemeContext } from '../../../common/context';
import Spinner from '../../../common/components/Interface/Spinner';
import ErrorModal from '../../../common/components/Interface/Modal/ErrorModal';
import {
    getURL,
    devLog,
    Functional,
    BoardResponse as IBoardResponse,
    CardResponse,
    ListResponse
} from '../../../common/util';

export type BoardResponse = IBoardResponse<ListResponse<CardResponse<string[]>[]>[]>;

/**
 * Display a single User Board.
 */

const UserBoard: Functional = (props) => {
    const boardId = useParams<{ boardId: string }>().boardId;
    const authContext = useContext(AuthContext);
    const { setColor } = useContext(ThemeContext);
    const { isLoading, error, clearError, sendRequest } = useHttp<BoardResponse>();
    const [board, setBoard] = useState<BoardResponse | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const res: BoardResponse | void = await sendRequest(getURL(`boards/${boardId}`), 'GET', null, {
                    Authorization: 'Bearer ' + authContext.token
                });
                res && setBoard(res);
            } catch (err) {
                devLog(err);
            }
        })();
    }, [sendRequest, boardId, authContext.token]);

    useEffect(() => {
        if (board) {
            setColor(board.color);
        }
    }, [setColor, board]);

    return (
        <Fragment>
            <ErrorModal onClear={clearError} error={error} show={!!error} />
            {isLoading && (
                <div className="center">
                    <Spinner asOverlay />
                </div>
            )}
            {!isLoading && board && <Board board={board} />}
        </Fragment>
    );
};

export default UserBoard;
