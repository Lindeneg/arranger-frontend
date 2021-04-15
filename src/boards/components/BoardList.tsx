import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';

import { CreationInput } from '../../common/components';
import { Board, BoardPayload } from '../../store/boards/types';
import { ColorOption, colorClassMap } from '../../common';

interface BoardListProps {
    boards: Board<string>[];
    onCreate: (payload: BoardPayload<'name' | 'color'>) => void;
    onDelete: () => void;
    onUpdate: () => void;
}

const BoardList: FC<BoardListProps> = (props) => {
    const history = useHistory();

    const onBoardSelect = (id: string): void => {
        history.push('/board/' + id);
    };

    const onBoardCreate = (name: string, color: ColorOption): void => {
        props.onCreate({ name, color });
    };

    return (
        <Container>
            <div className="d-flex justify-content-start flex-wrap">
                {props.boards.map((board, index) => (
                    <Card
                        key={index}
                        bg={colorClassMap[board.color]}
                        text={['light', 'yellow'].includes(board.color) ? 'dark' : 'light'}
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
                <p className="font-italic h6 text-info">
                    No boards found. Go ahead and create one.
                </p>
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
