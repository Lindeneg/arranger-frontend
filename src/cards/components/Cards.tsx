import React, { FC, Fragment, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Draggable } from 'react-beautiful-dnd';
import ListGroup from 'react-bootstrap/ListGroup';

import { CreationInput, ErrorModal } from '../../common/components';
import { RootState } from '../../store';
import { Card } from '../../store/cards/types';
import { createCard, updateCard, deleteCard, clearAnyCardError } from '../../store/actions';
import {
    ColorOption,
    ThemeOption,
    getCls,
    getColorText,
    colorClassMap,
    defaultTheme
} from '../../common';
import classes from './Cards.module.css';

interface CardsProps {
    owner: string;
    cards: Card[];
    cardOrder: string[];
    colorText: ThemeOption;
}

const Cards: FC<CardsProps> = (props) => {
    const dispatch = useDispatch();
    const { error } = useSelector((state: RootState) => state.card);

    const { owner } = props;

    const onCreateCard = (name: string, color?: ColorOption): void => {
        dispatch(createCard({ name, owner: props.owner, color: color || defaultTheme }));
    };

    const onUpdateCard = useCallback(
        (id: string, name: string, color: ColorOption, description: string) => {
            dispatch(updateCard(id, owner, { name, color, description }));
        },
        [dispatch, owner]
    );

    const onDeleteCard = useCallback(
        (id: string) => {
            dispatch(deleteCard(id, owner));
        },
        [dispatch, owner]
    );

    const onSelectCard = (id: string) => {
        console.log('select card ', id);
    };

    const clearError = (): void => {
        dispatch(clearAnyCardError());
    };

    return (
        <Fragment>
            <ErrorModal show={!!error} errorMessage={error} onClose={clearError} />
            <ListGroup>
                {props.cardOrder.map((cardId, index) => {
                    const card = props.cards.find((c) => c._id === cardId);
                    if (card) {
                        return (
                            <Draggable draggableId={cardId} index={index} key={cardId}>
                                {(provided) => (
                                    <div
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        ref={provided.innerRef}
                                    >
                                        <ListGroup.Item
                                            role="button"
                                            onClick={onSelectCard.bind(null, card._id)}
                                            className={getCls(
                                                'bg-' + colorClassMap[card.color as ColorOption],
                                                'text-' + getColorText(card.color as ColorOption),
                                                'mb-1 border',
                                                classes[card.color]
                                            )}
                                        >
                                            {card.name}
                                        </ListGroup.Item>
                                    </div>
                                )}
                            </Draggable>
                        );
                    }
                    console.log('not found: ', cardId);
                    return null;
                })}
                <CreationInput
                    style={{ marginTop: '1rem' }}
                    type="card"
                    customColor={props.colorText}
                    inputMaxLength={22}
                    placeholder="Card name"
                    colorSelectionDropDirection="up"
                    onCreate={onCreateCard}
                    color
                />
            </ListGroup>
        </Fragment>
    );
};

export default Cards;
