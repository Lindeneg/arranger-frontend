import { useState, useEffect, Fragment, useContext } from 'react';

import { useHttp } from '../../../common/hooks';
import { AuthContext, ThemeContext } from '../../../common/context';
import BoardList from '../../components/BoardList';
import Spinner from '../../../common/components/Interface/Spinner';
import ErrorModal from '../../../common/components/Interface/Modal/ErrorModal';
import { getURL, devLog, Functional, BoardResponse as IBoardResponse } from '../../../common/util';

type BoardResponse = IBoardResponse<string[]>;

/**
 * Display list of User Boards.
 */

const UserBoards: Functional = (props) => {
    const authContext = useContext(AuthContext);
    const { resetColor } = useContext(ThemeContext);
    const { isLoading, error, clearError, sendRequest } = useHttp<BoardResponse[]>();
    const [boards, setBoards] = useState<BoardResponse[]>([]);
    const [didRequest, setDidRequest] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            try {
                const res: BoardResponse[] | void = await sendRequest(
                    getURL(`boards/user/${authContext.userId}`),
                    'GET',
                    null,
                    {
                        Authorization: 'Bearer ' + authContext.token
                    }
                );
                res && setBoards(res);
            } catch (err) {
                devLog(err);
            } finally {
                setDidRequest(true);
            }
        })();
    }, [sendRequest, authContext.userId, authContext.token]);

    useEffect(() => {
        resetColor();
    }, [resetColor]);

    return (
        <Fragment>
            <ErrorModal onClear={clearError} error={error} show={!!error} />
            {isLoading && (
                <div className="center">
                    <Spinner asOverlay />
                </div>
            )}
            {!isLoading && didRequest && <BoardList boards={boards} />}
        </Fragment>
    );
};

export default UserBoards;
