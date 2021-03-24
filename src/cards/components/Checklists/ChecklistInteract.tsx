import { useState } from 'react';

import CheckedImage from '../../../assets/images/check-box.png';
import UncheckedImage from '../../../assets/images/blank-check-box.png';
import Button from '../../../common/components/Interactable/Button';
import { BaseProps, Clickable, Functional } from '../../../common/util';
import classes from './ChecklistInteract.module.css';

interface ChecklistInteractProps extends BaseProps, Clickable {
    display?: {
        isChecked: boolean;
        description: boolean
    }
}

const ChecklistInteract: Functional<ChecklistInteractProps> = (props) => {
    const [isChecked, setIsChecked] = useState<boolean>(props.display ? props.display.isChecked : false);

    const onCheckboxToggle = () => {
        setIsChecked((prev) => !prev);
    };

    return (
        <div className={classes.Container}>
            <div className={classes.Content}>
                <input
                    maxLength={60}
                    style={{ backgroundColor: 'transparent', color: '#ccc', width: '80%', height: '2rem' }}
                    onChange={(e) => {
                        console.log(e.target.value, e.target.type);
                    }}
                    type="text"
                ></input>
                <img
                    onClick={onCheckboxToggle}
                    src={isChecked ? CheckedImage : UncheckedImage}
                    width={32}
                    height={32}
                    alt="checkbox"
                />
            </div>
            <div className={classes.Control}>
                <Button type='button' inverse>CREATE</Button>
                <Button type='button' onClick={props.onClick} inverse>
                    CANCEL
                </Button>
            </div>
        </div>
    );
};

export default ChecklistInteract;
