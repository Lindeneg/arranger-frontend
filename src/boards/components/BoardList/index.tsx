import BoardListItem from './BoardListItem';
import Card from '../../../common/components/Interface/Card';
import Button from '../../../common/components/Interactable/Button';
import { BaseProps, BoardResponse, Functional } from '../../../common/util';
import classes from './BoardList.module.css';

interface BoardListProps extends BaseProps {
    boards: BoardResponse<string[], string[], string[]>[];
    onDelete: (boardId: string) => void;
}

/**
 * Component with list of Boards.
 */

const BoardList: Functional<BoardListProps> = (props) => {
    if (!(props.boards.length > 0)) {
        return (
            <div className={[classes.List, 'center'].join(' ')}>
                <Card>
                    <h2>No boards found. Go ahead and create one!</h2>
                    <Button link={{ to: '/boards/new' }}>Create Board</Button>
                </Card>
            </div>
        );
    }
    return (
        <ul className={classes.List}>
            {props.boards.map((board) => (
                <BoardListItem {...board} key={board._id} onDelete={props.onDelete} />
            ))}
        </ul>
    );
};

export default BoardList;
