import { useHistory } from 'react-router-dom';

import Card from '../../../../common/components/Interface/Card';
import { BaseProps, BoardResponse, Functional, getCustomDateStringFromTimestamp } from '../../../../common/util';
import classes from './BoardListItem.module.css';

interface BoardListProps extends BaseProps, BoardResponse<string[]> {}

const BoardListItem: Functional<BoardListProps> = (props) => {
    const history = useHistory();
    return (
        <div onClick={() => history.push('/board/' + props._id)} className={classes.Container}>
            <Card className={classes.Card} style={{ backgroundColor: props.color }}>
                <h2>{props.name}</h2>
                <hr />
                <div className={[classes.Info, classes.Time].join(' ')}>
                    {props.createdOn && <p>created {getCustomDateStringFromTimestamp(props.createdOn)}</p>}
                </div>
                <div className={[classes.Info, classes.Item].join(' ')}>
                    <p>
                        {props.lists.length} active {props.lists.length === 1 ? 'list' : 'lists'}
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default BoardListItem;
