import Card from '../../../common/components/Interface/Card';
import {
    BaseProps,
    CardResponse,
    DragType,
    Functional,
    ListResponse,
    OptCls,
    DragEventHandler
} from '../../../common/util';
import classes from './ListItem.module.css';

interface ListItemProps extends BaseProps, OptCls, ListResponse<CardResponse<string[]>[]> {
    boardColor: string;
    onDragEnd: DragEventHandler<HTMLLIElement>;
    onDragOver: DragEventHandler<HTMLLIElement>;
}

const ListItem: Functional<ListItemProps> = (props) => {
    return (
        <li
            draggable-type={DragType.List}
            style={props.style}
            id={props._id}
            draggable
            onDragOver={props.onDragOver}
            onDragEnd={props.onDragEnd}
        >
            <Card className={classes.Item}>
                <div className={classes.Header}>
                    <h3>{props.name}</h3>
                </div>
                <hr style={{ marginTop: '0' }} />
            </Card>
        </li>
    );
};

export default ListItem;
