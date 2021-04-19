import React, { FC, Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { Trash, PencilSquare } from 'react-bootstrap-icons';

import { RootState } from '../../store';
import { deselectCard, updateCard, deleteCard } from '../../store/actions';
import {
    ColorOption,
    getCls,
    getColorText,
    colorClassMap,
    defaultTheme,
    emptyDescription
} from '../../common';
import { Hr, CreationInput, ConfirmModal } from '../../common/components';
import classes from './Cards.module.css';

// const testChecklists = [
//     {
//         _id: 1,
//         objective: 'do something really nice',
//         isCompleted: false
//     },
//     {
//         _id: 2,
//         objective: 'do something else',
//         isCompleted: false
//     },
//     {
//         _id: 3,
//         objective: 'hey! this is already done',
//         isCompleted: false
//     }
// ];

// const testChecklistOrder = [3, 1, 2];

type EditType = 'name' | 'description';

const CardModal: FC = () => {
    const dispatch = useDispatch();
    const { card } = useSelector((state: RootState) => state.card);
    const [deleting, setDeleting] = useState<boolean>(false);
    const [deleteInProgress, setDeleteInProgress] = useState<boolean>(false);
    const [editing, setEditing] = useState<EditType | null>(null);
    const colorText = card ? getColorText(card.color) : defaultTheme;

    const onUpdateCard = (type: EditType, value: string, color?: ColorOption): void => {
        if (
            card &&
            ((type === 'name' && value !== card.name) ||
                (type === 'description' && value !== card.description) ||
                (typeof color !== 'undefined' && color !== card.color))
        ) {
            dispatch(updateCard(card._id, card.owner, { [type]: value, color }));
        }
        setEditing(null);
    };

    const onDeleteCard = async (): Promise<void> => {
        setDeleteInProgress(true);
        if (card) {
            await dispatch(deleteCard(card._id, card.owner));
        }
        setDeleteInProgress(false);
    };

    const onDeselectCard = (): void => {
        dispatch(deselectCard());
        setEditing(null);
    };

    return (
        <Fragment>
            <ConfirmModal
                show={deleting}
                onClose={() => setDeleting(false)}
                onConfirm={onDeleteCard}
                headerTxt="Confirm Card Deletion"
                notCenter
            />
            <Modal
                show={card !== null && !deleting && !deleteInProgress}
                onHide={onDeselectCard}
                dialogClassName={classes.cardModal}
                contentClassName={getCls(
                    'bg-' + colorClassMap[card?.color || defaultTheme],
                    'text-' + colorText
                )}
                aria-labelledby="card-modal-control-options"
            >
                <Modal.Body>
                    <div className="d-flex align-items-baseline justify-content-between">
                        {editing === 'name' ? (
                            <CreationInput
                                type="card"
                                inputMaxLength={22}
                                customColor={colorText}
                                chosenColor={card?.color}
                                placeholder="Card name"
                                inputValue={card?.name}
                                onClose={() => setEditing(null)}
                                onCreate={onUpdateCard.bind(null, 'name')}
                                alwaysShowInput
                                color
                            />
                        ) : (
                            <h1 onClick={() => setEditing('name')} className={classes.cardName}>
                                {card?.name}
                            </h1>
                        )}
                        <OverlayTrigger
                            placement="bottom"
                            overlay={<Tooltip id="tooltip-bottom">delete card</Tooltip>}
                        >
                            <Trash role="button" size="25" onClick={() => setDeleting(true)} />
                        </OverlayTrigger>
                    </div>
                    <Hr colorText={colorText} />
                    <div className="mt-4 mb-4">
                        {editing === 'description' ? (
                            <CreationInput
                                style={{ width: '100%' }}
                                type="card"
                                as="textarea"
                                asProps={{ rows: 5 }}
                                inputMaxLength={512}
                                customColor={colorText}
                                chosenColor={card?.color}
                                placeholder="Card description"
                                inputValue={
                                    card?.description === emptyDescription ? '' : card?.description
                                }
                                onClose={() => setEditing(null)}
                                onCreate={onUpdateCard.bind(null, 'description')}
                                alwaysShowInput
                            />
                        ) : (
                            <div className="d-flex align-items-baseline justify-content-between">
                                <pre
                                    className={getCls(
                                        'text-' + colorText,
                                        card?.description === emptyDescription ? 'font-italic' : '',
                                        classes.cardDescription
                                    )}
                                >
                                    {card?.description +
                                        (card?.description === emptyDescription ? '...' : '')}
                                </pre>
                                <OverlayTrigger
                                    placement="bottom"
                                    overlay={
                                        <Tooltip id="tooltip-bottom">edit description</Tooltip>
                                    }
                                >
                                    <PencilSquare
                                        role="button"
                                        size="25"
                                        onClick={() => setEditing('description')}
                                    />
                                </OverlayTrigger>
                            </div>
                        )}
                    </div>
                    <Hr colorText={colorText} />
                    <h3>Checklists</h3>
                    {/* CHECKLISTS*/}
                </Modal.Body>
            </Modal>
        </Fragment>
    );
};

export default CardModal;
