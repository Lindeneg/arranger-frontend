import React, { FC, Fragment, useCallback } from 'react';
import Container from 'react-bootstrap/Container';
import { useDispatch } from 'react-redux';

import BoardHeader from './BoardHeader';
import Lists from '../../lists/components/Lists';
import CardModal from '../../cards/components/CardModal';
import { createList } from '../../store/actions';
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
    const colorText = getColorText(props.board.color);

    const { board, onUpdate } = props;

    const updateBoard = useCallback(
        (name: string, color: ColorOption): void => {
            if (name !== board.name || color !== board.color) {
                onUpdate({ name, color });
            }
        },
        [board, onUpdate]
    );

    const onCreateList = useCallback(
        (name: string): void => {
            dispatch(createList({ name, owner: board._id }));
        },
        [dispatch, board]
    );

    return (
        <Fragment>
            <CardModal />
            <Container
                fluid={true}
                className={getCls('bg-' + colorClassMap[props.board.color], 'text-' + colorText)}
                style={{
                    width: '96vw',
                    height: '85vh',
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
