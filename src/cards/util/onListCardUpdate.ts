import { CardResponse, ChecklistResponse, IList, UpdateStateAction } from '../../common/util';

export const onListCardUpdate = (
    action: UpdateStateAction,
    card: CardResponse<ChecklistResponse[]>,
    currentLists: IList[]
): IList[] => {
    const newLists = [...currentLists];
    const targetListIdx = newLists.findIndex((e) => e._id === card.owner);
    if (targetListIdx > -1) {
        const targetList = { ...newLists[targetListIdx] };
        if (targetList) {
            const newTargetList = { ...targetList };
            if (action === UpdateStateAction.Create) {
                const newCards = [...newTargetList.cards];
                const newOrder = [...newTargetList.order];
                newCards.push({ ...card, checklists: card.checklists.map((e) => e._id) });
                newOrder.push(card._id);
                newTargetList.cards = newCards;
                newTargetList.order = newOrder;
            } else {
                const targetCardIdx = newTargetList.cards.findIndex((e) => e._id === card._id);
                if (targetCardIdx > -1) {
                    if (action === UpdateStateAction.Delete) {
                        newTargetList.cards = newTargetList.cards.filter((e) => e._id !== card._id);
                        newTargetList.order = newTargetList.order.filter((e) => e !== card._id);
                    } else if (action === UpdateStateAction.Update) {
                        newTargetList.cards[targetCardIdx] = {
                            ...newTargetList.cards[targetCardIdx],
                            name: card.name,
                            description: card.description,
                            owner: card.owner
                        };
                    }
                }
            }
            newLists[targetListIdx] = newTargetList;
        }
    }
    return newLists;
};
