import Card from '../../../../common/components/Interface/Card';
import { BaseProps, BoardResponse, Functional } from '../../../../common/util';

interface BoardListProps extends BaseProps, BoardResponse<string[], string[], string[]> {}

const BoardListItem: Functional<BoardListProps> = (props) => {
    
    
    return (
        <div onClick={(e) => console.log(e)}>
            <Card style={{backgroundColor: props.color, width: '350px'}}>
                <h2>{props.name}</h2>
            </Card>
        </div>
    )
};

export default BoardListItem;
