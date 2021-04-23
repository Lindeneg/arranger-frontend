import React, { FC, Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { Draggable } from 'react-beautiful-dnd';
import ListGroup from 'react-bootstrap/ListGroup';
import { Check } from 'react-bootstrap-icons';

import { CreationInput, Hr } from '../../common/components';
import { Card } from '../../store/cards/types';
import { initCard, createCard } from '../../store/actions';
import {
    ColorOption,
    ThemeOption,
    getCls,
    getColorText,
    countCompletedChecklistEntries,
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

    const onCreateCard = (name: string, color?: ColorOption): void => {
        dispatch(createCard({ name, owner: props.owner, color: color || defaultTheme }));
    };

    const onSelectCard = (id: string): void => {
        const card = props.cards.find((card) => card._id === id);
        if (card) {
            dispatch(initCard(card));
        }
    };

    return (
        <Fragment>
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
                                            <Hr
                                                colorText={getColorText(card.color as ColorOption)}
                                            />
                                            <div className="d-flex align-items-center">
                                                {(card.checklists.length > 0
                                                    ? (
                                                          (countCompletedChecklistEntries(
                                                              card.checklists
                                                          ) /
                                                              card.checklists.length) *
                                                          100
                                                      ).toFixed(1)
                                                    : '0.0') + '%'}
                                                <Check size="25" />
                                            </div>
                                        </ListGroup.Item>
                                    </div>
                                )}
                            </Draggable>
                        );
                    }
                    return null;
                })}
                <CreationInput
                    style={{ marginTop: '1rem', width: '16.5rem' }}
                    type="card"
                    customColor={props.colorText}
                    inputMaxLength={22}
                    placeholder="Card name"
                    onCreate={onCreateCard}
                    color
                />
            </ListGroup>
        </Fragment>
    );
};

export default Cards;
