import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';

import { CreationInput } from '../../common/components';
import { Board, BoardPayload } from '../../store/boards/types';
import { ColorOption, colorClassMap, getColorText, defaultTheme } from '../../common';

interface BoardListProps {
    boards: Board<string>[];
    onCreate: (payload: BoardPayload<'name' | 'color'>) => void;
}

const BoardList: FC<BoardListProps> = (props) => {
    const history = useHistory();

    const onBoardSelect = (id: string): void => {
        history.push('/board/' + id);
    };

    const onBoardCreate = (name: string, color?: ColorOption): void => {
        props.onCreate({ name, color: color || defaultTheme });
    };

    return (
        <Container>
            <div className="d-flex justify-content-start flex-wrap">
                {props.boards.map((board, index) => (
                    <Card
                        key={index}
                        bg={colorClassMap[board.color]}
                        text={getColorText(board.color)}
                        style={{ width: '16rem', height: '6rem' }}
                        className="mb-2 mr-2"
                        role="button"
                        onClick={onBoardSelect.bind(null, board._id)}
                    >
                        <Card.Body>
                            <Card.Text style={{ fontSize: '1.2rem' }}>{board.name}</Card.Text>
                        </Card.Body>
                    </Card>
                ))}
            </div>
            {props.boards.length <= 0 && (
                <Alert variant="info">No boards found. Go ahead and create one.</Alert>
            )}
            <CreationInput
                type="board"
                inputMaxLength={16}
                placeholder="Board name"
                onCreate={onBoardCreate}
                color
            />
        </Container>
    );
};

export default BoardList;
