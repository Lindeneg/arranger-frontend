import { FC } from 'react';
import { useSelector } from 'react-redux';
import BSpinner from 'react-bootstrap/Spinner';

import { RootState } from '../../../store';
import classes from './Spinner.module.css';
import { negateTheme } from '../../func';

export interface SpinnerProps {
    absoluteCentered?: boolean;
    relativelyCentered?: boolean;
}

export const Spinner: FC<SpinnerProps> = (props) => {
    const { theme } = useSelector((state: RootState) => state.user);
    return (
        <div className={props.absoluteCentered ? classes.absoluteCenter : classes.relativelyCenter}>
            <BSpinner animation="border" role="status" variant={negateTheme(theme)}>
                <span className="sr-only">Loading...</span>
            </BSpinner>
        </div>
    );
};

export default Spinner;
