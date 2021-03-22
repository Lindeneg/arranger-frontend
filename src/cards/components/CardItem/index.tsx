import { BaseProps, CardResponse, Clickable, Functional } from '../../../common/util';
import classes from './CardItem.module.css';

interface CardItemProps extends BaseProps, Clickable, CardResponse<string[]> {}

const CardItem: Functional<CardItemProps> = (props) => {
    return (
        <div onClick={props.onClick} className={classes.Item}>
            {props.name}
            <br />
            {props.checklists.length} checklists
        </div>
    );
};

export default CardItem;
