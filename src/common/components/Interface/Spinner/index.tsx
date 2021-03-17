import { Functional, BaseProps } from '../../../util';
import classes from './Spinner.module.css';

interface SpinnerProps extends BaseProps {
    asOverlay?: boolean;
}

/**
 * A component that ... spins! Useful when waiting for resources.
 */

const Spinner: Functional<SpinnerProps> = (props) => (
    <div className={`${props.asOverlay && classes.Overlay}`}>
        <div className={classes.Spinner}></div>
    </div>
);

export default Spinner;
