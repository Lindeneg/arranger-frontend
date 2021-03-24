import { Draggable } from 'react-beautiful-dnd';

import { BaseProps, CardResponse, Clickable, Functional } from '../../../common/util';
import classes from './CardItem.module.css';

interface CardItemProps extends BaseProps, Clickable, CardResponse<string[]> {
    index: number;
}

const CardItem: Functional<CardItemProps> = (props) => {
    return (
        <Draggable draggableId={props._id} index={props.index}>
            {(provided) => (
                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                    <div onClick={props.onClick} className={classes.Item} style={props.style}>
                        {props.name}
                    </div>
                </div>
            )}
        </Draggable>
    );
};

export default CardItem;
