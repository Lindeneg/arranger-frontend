import { Fragment, useState } from 'react';

import CardModal from './CardModal';
import CardItem from './CardItem';
import Button from '../../common/components/Interactable/Button';
import { BaseProps, CardResponse, Functional, ListUpdatable, Orderable } from '../../common/util';
import classes from './Cards.module.css';

interface CardsProps extends BaseProps, Orderable, ListUpdatable {
    listOwnerId: string;
    cards: CardResponse<string[]>[];
}

const Cards: Functional<CardsProps> = (props) => {
    const [isViewingCardId, setIsViewingCardId] = useState<string | null>(null);
    const [isCreatingCard, setIsCreatingCard] = useState<boolean>(false);

    const onCreateCardAccept = () => {
        setIsCreatingCard(true);
        setIsViewingCardId(null);
    };

    const onViewCardAccept = (id: string) => {
        setIsViewingCardId(id);
        setIsCreatingCard(false);
    };

    const onViewCardDeny = () => {
        setIsCreatingCard(false);
        setIsViewingCardId(null);
    };

    return (
        <Fragment>
            <CardModal
                updateLists={props.updateLists}
                listOwnerId={props.listOwnerId}
                cardId={isViewingCardId}
                show={!!isViewingCardId || isCreatingCard}
                onClick={onViewCardDeny}
            />
            <div className={classes.Container}>
                <div className={classes.Cards}>
                    {props.order.map((id, index) => {
                        const card = props.cards.find((e) => e._id === id);
                        if (card) {
                            return (
                                <CardItem
                                    {...card}
                                    key={card._id}
                                    index={index}
                                    onClick={onViewCardAccept.bind(null, card._id)}
                                />
                            );
                        } else {
                            return null;
                        }
                    })}
                </div>
                <Button inverse type="button" onClick={onCreateCardAccept}>
                    ADD CARD
                </Button>
            </div>
        </Fragment>
    );
};

export default Cards;
