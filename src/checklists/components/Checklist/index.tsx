import { useState } from 'react';

import { StatefulChecklist } from '../';
import CheckedImage from '../../../assets/images/check-box.png';
import UncheckedImage from '../../../assets/images/blank-check-box.png';
import DenyImage from '../../../assets/images/minus-circle.png';
import AcceptImage from '../../../assets/images/plus-circle.png';
import DeleteImage from '../../../assets/images/delete-icon.png';
import { BaseProps, Clickable, Functional } from '../../../common/util';
import classes from './Checklist.module.css';

interface ChecklistProps extends BaseProps, Partial<Clickable> {
    isEditing: boolean;
    display: StatefulChecklist;
    onEditAccept: () => void;
    onEditDeny: () => void;
}

const Checklist: Functional<ChecklistProps> = (props) => {
    const [isChecked, setIsChecked] = useState<boolean>(props.display.isCompleted);
    const [description, setDescription] = useState<string>(props.display.description);

    const onCheckboxToggle = () => {
        setIsChecked((prev) => !prev);
    };

    return (
        <div className={classes.Container}>
            <div className={classes.Content}>
                {props.isEditing ? (
                    <input
                        value={description}
                        className={classes.Description}
                        maxLength={60}
                        onChange={(e) => {
                            setDescription(e.target.value);
                        }}
                        type="text"
                    />
                ) : (
                    <p
                        onClick={props.onEditAccept}
                        className={[classes.Description, isChecked && classes.Checked].join(' ')}
                    >
                        {description}
                    </p>
                )}
                {props.isEditing && (
                    <div className={classes.Control}>
                        <img src={AcceptImage} width={32} height={32} alt="accept" />
                        <img onClick={props.onEditDeny} src={DenyImage} width={32} height={32} alt="cancel" />
                        {(typeof props.display.isCreating === 'undefined' || props.display.isCreating !== true) && (
                            <img src={DeleteImage} width={32} height={32} alt="delete" />
                        )}
                    </div>
                )}
                <img
                    onClick={onCheckboxToggle}
                    src={isChecked ? CheckedImage : UncheckedImage}
                    width={32}
                    height={32}
                    alt="checkbox"
                />
            </div>
        </div>
    );
};

export default Checklist;
