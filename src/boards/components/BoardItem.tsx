import React, { FC } from 'react';
import Card from 'react-bootstrap/Card';
import { colorClassMap } from '../../common';

import { Board } from '../../store/boards/types';

interface BoardItemProps {
    board: Board<string>;
    onClick: () => void;
}

const BoardItem: FC<BoardItemProps> = (props) => (
    <Card
        bg={colorClassMap[props.board.color]}
        text={['light', 'yellow'].includes(props.board.color) ? 'dark' : 'light'}
        style={{ width: '16rem', height: '6rem' }}
        className="mb-2 mr-2"
        role="button"
        onClick={props.onClick}
    >
        <Card.Body>
            <Card.Text style={{ fontSize: '1.2rem' }}>{props.board.name}</Card.Text>
        </Card.Body>
    </Card>
);

export default BoardItem;
