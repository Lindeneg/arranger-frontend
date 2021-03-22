import { Fragment, useState } from 'react';

import CardModal from './CardModal';
import CardItem from './CardItem';
import Button from '../../common/components/Interactable/Button';
import { BaseProps, CardResponse, Functional } from '../../common/util';
import classes from './Cards.module.css';

interface CardsProps extends BaseProps {
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
                listOwnerId={props.listOwnerId}
                cardId={isViewingCardId}
                show={!!isViewingCardId || isCreatingCard}
                onClick={onViewCardDeny}
            />
            <div className={classes.Container}>
                <div className={classes.Cards}>
                    {props.cards.map((card) => (
                        <div key={card._id} onClick={onViewCardAccept.bind(null, card._id)}>
                            <CardItem />
                        </div>
                    ))}
                </div>
                <Button inverse onClick={onCreateCardAccept}>
                    ADD CARD
                </Button>
            </div>
        </Fragment>
    );
};

export default Cards;
