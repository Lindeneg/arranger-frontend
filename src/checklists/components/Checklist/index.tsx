import { useState, useContext, useCallback, Fragment } from 'react';

import { StatefulChecklist } from '../';
import { useHttp } from '../../../common/hooks';
import { AuthContext, IAuthContext } from '../../../common/context';
import ErrorModal from '../../../common/components/Interface/Modal/ErrorModal';
import {
    BaseProps,
    ChecklistResponse,
    Clickable,
    devLog,
    Functional,
    getURL,
    OnChange,
    RULE,
    UpdateStateAction
} from '../../../common/util';
import classes from './Checklist.module.css';

import CheckedImage from '../../../assets/images/check-box.png';
import UncheckedImage from '../../../assets/images/blank-check-box.png';
import DenyImage from '../../../assets/images/minus-circle.png';
import AcceptImage from '../../../assets/images/plus-circle.png';
import DeleteImage from '../../../assets/images/delete-icon.png';

interface ChecklistProps extends BaseProps, Partial<Clickable> {
    updateChecklists: (action: UpdateStateAction, checklist: ChecklistResponse | string) => void;
    isEditing: boolean;
    display: StatefulChecklist;
    onEditAccept: () => void;
    onEditDeny: () => void;
}

const Checklist: Functional<ChecklistProps> = (props) => {
    const authContext = useContext<IAuthContext>(AuthContext);
    const { error, clearError, sendRequest } = useHttp<ChecklistResponse>();
    const [isChecked, setIsChecked] = useState<boolean>(props.display.isCompleted);
    const [description, setDescription] = useState<string>(props.display.description);

    const onChange: OnChange<HTMLInputElement> = useCallback((event) => {
        setDescription(event.target.value);
    }, []);

    const onCheckboxToggle = () => {
        setIsChecked((prev) => {
            const newVal = !prev;
            onChecklistUpdate(newVal);
            return newVal;
        });
    };

    const onChecklistUpdate = async (completed: boolean | null) => {
        try {
            const res: ChecklistResponse | void = await sendRequest(
                getURL('checklists' + (!props.display.isCreating ? `/${props.display._id}` : '')),
                !props.display.isCreating ? 'PATCH' : 'POST',
                JSON.stringify({
                    name: Math.random(), // todo edit accepted response on backend, name is unused but required
                    description,
                    isCompleted: completed === null ? isChecked : completed,
                    owner: props.display.owner
                }),
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + authContext.token
                }
            );
            if (res) {
                props.updateChecklists(
                    !props.display.isCreating ? UpdateStateAction.Update : UpdateStateAction.Create,
                    res
                );
                props.onEditDeny();
            }
        } catch (err) {
            devLog(err);
        }
    };

    const onChecklistDelete = async () => {
        if (props.display._id) {
            try {
                const res: ChecklistResponse | void = await sendRequest(
                    getURL(`checklists/${props.display._id}`),
                    'DELETE',
                    null,
                    {
                        Authorization: 'Bearer ' + authContext.token
                    }
                );
                if (res) {
                    props.updateChecklists(UpdateStateAction.Delete, props.display._id);
                    props.onEditDeny();
                }
            } catch (err) {
                devLog(err);
            }
        }
    };

    return (
        <Fragment>
            <ErrorModal show={!!error} error={error} onClear={clearError} />
            <div className={classes.Container}>
                <div className={classes.Content}>
                    {props.isEditing ? (
                        <input
                            value={description}
                            className={classes.Description}
                            maxLength={RULE.DEFAULT_MAX_LEN}
                            onChange={onChange}
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
                            <img
                                onClick={onChecklistUpdate.bind(null, null)}
                                src={AcceptImage}
                                width={32}
                                height={32}
                                alt="accept"
                            />
                            <img onClick={props.onEditDeny} src={DenyImage} width={32} height={32} alt="cancel" />
                            {(typeof props.display.isCreating === 'undefined' || props.display.isCreating !== true) && (
                                <img
                                    onClick={onChecklistDelete}
                                    src={DeleteImage}
                                    width={32}
                                    height={32}
                                    alt="delete"
                                />
                            )}
                        </div>
                    )}
                    {!props.isEditing && (
                        <img
                            onClick={onCheckboxToggle}
                            src={isChecked ? CheckedImage : UncheckedImage}
                            width={32}
                            height={32}
                            alt="checkbox"
                        />
                    )}
                </div>
            </div>
        </Fragment>
    );
};

export default Checklist;
