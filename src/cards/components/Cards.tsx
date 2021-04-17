import React, { FC, Fragment } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';

import { CreationInput } from '../../common/components';
import { Card } from '../../store/cards/types';
import { ColorOption, ThemeOption, getCls, getColorText, colorClassMap } from '../../common';
import classes from './Cards.module.css';

interface CardsProps {
    cards: Card[];
    cardOrder: string[];
    colorText: ThemeOption;
}

const testCards = [
    { _id: 1, name: 'some card name', color: 'dark' },
    { _id: 2, name: 'another card name', color: 'light' },
    { _id: 3, name: 'third card name', color: 'blue' },
    { _id: 4, name: 'fourth card name', color: 'gray' },
    { _id: 5, name: 'fifth card name', color: 'green' },
    { _id: 6, name: 'sixth card name', color: 'red' },
    { _id: 7, name: 'seventh card name', color: 'yellow' },
    { _id: 8, name: 'eight card name', color: 'teal' }
];

const testOrder = testCards.map((e) => e._id);

const Cards: FC<CardsProps> = (props) => {
    return (
        <Fragment>
            <ListGroup>
                {testOrder.map((cardId) => {
                    const card = testCards.find((c) => c._id === cardId);
                    if (card) {
                        return (
                            <ListGroup.Item
                                key={card._id}
                                className={getCls(
                                    'bg-' + colorClassMap[card.color as ColorOption],
                                    'text-' + getColorText(card.color as ColorOption),
                                    'mb-1 border',
                                    classes[card.color]
                                )}
                            >
                                {card.name}
                            </ListGroup.Item>
                        );
                    }
                    return null;
                })}
            </ListGroup>
            <CreationInput
                style={{ width: '90%', marginTop: '1rem' }}
                type="card"
                customColor={props.colorText}
                inputMaxLength={22}
                placeholder="Card name"
                colorSelectionDropDirection="up"
                onCreate={() => null}
                color
            />
        </Fragment>
    );
};

export default Cards;
