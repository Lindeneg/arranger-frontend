import React, { FC } from 'react';
import Container from 'react-bootstrap/Container';

import { CreationInput } from '../../common/components';
import { Board, BoardPayload } from '../../store/boards/types';
import { List } from '../../store/lists/types';
import { getCls, getColorText } from '../../common';

interface BoardItemProps {
    board: Board<List>;
    onUpdate: (payload: BoardPayload<'name' | 'color' | 'lists' | 'listOrder'>) => void;
    onDelete: () => void;
}

const BoardItem: FC<BoardItemProps> = (props) => {
    return (
        <Container
            fluid={true}
            className={getCls(
                'border',
                'bg-' + props.board.color,
                'text-' + getColorText(props.board.color)
            )}
            style={{
                width: '96vw',
                height: '80vh',
                marginLeft: '2vw',
                overflowX: 'scroll'
            }}
        >
            <div>
                <p>{props.board.name.toUpperCase()}</p>
                <hr />
            </div>
            <CreationInput
                type="board"
                inputMaxLength={16}
                placeholder="Board name"
                onCreate={() => null}
            />
        </Container>
    );
};

export default BoardItem;
