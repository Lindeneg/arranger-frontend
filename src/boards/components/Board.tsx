import React, { FC } from 'react';
import Container from 'react-bootstrap/Container';

import BoardHeader from './BoardHeader';
import { CreationInput } from '../../common/components';
import { Board as BoardType, BoardPayload } from '../../store/boards/types';
import { List } from '../../store/lists/types';
import { getCls, colorClassMap, getColorText, themeToHex, ColorOption } from '../../common';

interface BoardProps {
    board: BoardType<List>;
    onUpdate: (payload: BoardPayload<'name' | 'color' | 'lists' | 'listOrder'>) => void;
    onDelete: () => void;
}

const Board: FC<BoardProps> = (props) => {
    const colorText = getColorText(props.board.color);

    const updateBoard = (name: string, color: ColorOption): void => {
        if (name !== props.board.name || color !== props.board.color) {
            props.onUpdate({ name, color });
        }
    };

    return (
        <Container
            fluid={true}
            className={getCls('bg-' + colorClassMap[props.board.color], 'text-' + colorText)}
            style={{
                width: '96vw',
                height: '80vh',
                marginLeft: '2vw',
                overflowX: 'scroll'
            }}
        >
            <BoardHeader
                onDelete={props.onDelete}
                onUpdate={updateBoard}
                colorText={colorText}
                name={props.board.name}
                color={props.board.color}
            />

            <hr style={{ borderTop: '1px solid ' + themeToHex(colorText) }} />

            {/* LISTS */}

            <CreationInput
                type="list"
                inputMaxLength={12}
                placeholder="List name"
                onCreate={() => null}
                customColor={colorText}
            />
        </Container>
    );
};

export default Board;
