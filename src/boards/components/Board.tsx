import React, { FC, Fragment } from 'react';
import Container from 'react-bootstrap/Container';
import { useSelector, useDispatch } from 'react-redux';

import BoardHeader from './BoardHeader';
import Lists from '../../lists/components/Lists';
import { ErrorModal } from '../../common/components';
import { RootState } from '../../store';
import { createList, clearAnyListError } from '../../store/actions';
import { Board as BoardType, BoardPayload } from '../../store/boards/types';
import { List } from '../../store/lists/types';
import { getCls, colorClassMap, getColorText, ColorOption } from '../../common';

interface BoardProps {
    board: BoardType<List>;
    onUpdate: (payload: BoardPayload<'name' | 'color' | 'listOrder'>) => void;
    onDelete: () => void;
}

const Board: FC<BoardProps> = (props) => {
    const dispatch = useDispatch();
    const { error } = useSelector((state: RootState) => state.list);
    const colorText = getColorText(props.board.color);

    const updateBoard = (name: string, color: ColorOption): void => {
        if (name !== props.board.name || color !== props.board.color) {
            props.onUpdate({ name, color });
        }
    };

    const onCreateList = (name: string): void => {
        dispatch(createList({ name, owner: props.board._id }));
    };

    const clearError = (): void => {
        dispatch(clearAnyListError());
    };

    return (
        <Fragment>
            <ErrorModal show={!!error} errorMessage={error} onClose={clearError} />
            <Container
                fluid={true}
                className={getCls('bg-' + colorClassMap[props.board.color], 'text-' + colorText)}
                style={{
                    width: '96vw',
                    height: '80vh',
                    marginLeft: '2vw',
                    borderRadius: '1rem',
                    overflowX: 'scroll'
                }}
            >
                <BoardHeader
                    onDelete={props.onDelete}
                    onUpdate={updateBoard}
                    onCreateList={onCreateList}
                    colorText={colorText}
                    name={props.board.name}
                    color={props.board.color}
                />

                <Lists owner={props.board._id} colorText={colorText} />
            </Container>
        </Fragment>
    );
};

export default Board;
