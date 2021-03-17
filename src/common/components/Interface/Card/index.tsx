import { BaseProps, OptCls, Functional } from '../../../util';
import classes from './Card.module.css';

interface CardProps extends BaseProps, OptCls {}

/**
 * Card component for wrapping another component as its child(ren).
 */

const Card: Functional<CardProps> = (props) => (
    <div className={[classes.Card, props.className].join(' ')} style={props.style}>
        {props.children}
    </div>
);

export default Card;
