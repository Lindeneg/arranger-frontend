import { BaseProps, BoardResponse, Functional } from '../../../../common/util';

interface BoardListProps extends BaseProps, BoardResponse<string[], string[], string[]> {
    onDelete: (boardId: string) => void;
}

const BoardListItem: Functional<BoardListProps> = (props) => {
    return <div>BOARD: {props.name}</div>;
};

export default BoardListItem;
