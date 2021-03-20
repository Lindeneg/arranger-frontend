import Card from '../../../common/components/Interface/Card';
import { BaseProps, CardResponse, Functional, ListResponse } from '../../../common/util';
import classes from './ListItem.module.css';

interface ListItemProps extends BaseProps, ListResponse<CardResponse<string[]>[]> {
    boardColor: string;
}

// UPDATE BOARD MODAL / DRAG LIST ITEMS

const ListItem: Functional<ListItemProps> = (props) => {
    return (
        <Card className={classes.Item}>
            <div className={classes.Header}>
                <h3>{props.name}</h3>
            </div>
            <hr style={{ marginTop: '0' }} />
        </Card>
    );
};

export default ListItem;
