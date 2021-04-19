import React, { FC, Fragment } from 'react';
import { useSelector } from 'react-redux';
import Modal from 'react-bootstrap/Modal';

import { RootState } from '../../store';
import {
    ColorOption,
    getCls,
    getColorText,
    colorClassMap,
    defaultTheme,
    emptyDescription
} from '../../common';
import { Hr } from '../../common/components';
import classes from './Cards.module.css';

interface CardModalProps {
    onClose: () => void;
    onUpdate: (id: string, name: string, color: ColorOption, description: string) => void;
    onDelete: (id: string) => void;
}

const CardModal: FC<CardModalProps> = (props) => {
    const { card } = useSelector((state: RootState) => state.card);
    const colorText = card ? getColorText(card.color) : defaultTheme;
    return (
        <Fragment>
            {card !== null && (
                <Modal
                    show={true}
                    onHide={props.onClose}
                    dialogClassName={classes.cardModal}
                    contentClassName={getCls(
                        'bg-' + colorClassMap[card.color],
                        'text-' + colorText
                    )}
                    aria-labelledby="card-modal-control-options"
                >
                    <Modal.Body>
                        <div>
                            <h1>{card.name}</h1>
                        </div>
                        <Hr colorText={colorText} />
                        <div>
                            <p
                                className={
                                    card.description === emptyDescription ? 'font-italic' : ''
                                }
                            >
                                {card.description}
                            </p>
                        </div>
                        <Hr colorText={colorText} />
                        <div>
                            <h3>Checklists</h3>
                        </div>
                        {/* CHECKLISTS*/}
                    </Modal.Body>
                </Modal>
            )}
        </Fragment>
    );
};

export default CardModal;
