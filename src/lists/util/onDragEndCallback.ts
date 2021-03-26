import { DropResult } from 'react-beautiful-dnd';
import { DropType, getURL, IList } from '../../common/util';

export interface DragEndCallbackResult {
    http: {
        url: string | null;
        body: string | null;
    };
    newLists: IList[];
    newOrder: string[];
}

interface IBoard {
    id: string;
    color: string;
    name: string;
}

export const onDragEndCallback = (
    result: DropResult,
    order: string[],
    lists: IList[],
    board: IBoard
): DragEndCallbackResult => {
    const newOrder = [...order];
    const newLists = [...lists];
    let url: string | null = null;
    let body: string | null = null;
    if (result.destination) {
        switch (result.type) {
            case DropType.List:
                if (result.destination.index !== result.source.index) {
                    const [src] = newOrder.splice(result.source.index, 1);
                    newOrder.splice(result.destination.index, 0, src);
                    url = getURL(`boards/${board.id}`);
                    body = JSON.stringify({
                        name: board.name,
                        color: board.color,
                        order: newOrder
                    });
                }
                break;
            case DropType.Card:
                if (
                    result.source.droppableId === result.destination?.droppableId &&
                    result.source.index === result.destination.index
                ) {
                    break;
                }
                const srcList = newLists.find((e) => e._id === result.source.droppableId);
                const desList = newLists.find((e) => e._id === result.destination?.droppableId);
                if (typeof srcList !== 'undefined' && typeof desList !== 'undefined') {
                    const newSrcOrder = [...srcList.order];
                    const newDestOrder = [...desList.order];
                    const card = srcList.cards.find((e) => e._id === result.draggableId);
                    console.log(card);
                    if (card) {
                        const targetOrder = srcList._id === desList._id ? newSrcOrder : newDestOrder;
                        const [target] = newSrcOrder.splice(result.source.index, 1);
                        if (result.destination.index < targetOrder.length && targetOrder.length > 0) {
                            targetOrder.splice(result.destination.index, 0, target);
                        } else {
                            targetOrder.push(target);
                        }
                        srcList.order = newSrcOrder;
                        if (srcList._id !== desList._id) {
                            desList.order = newDestOrder;
                            srcList.cards = srcList.cards.filter((e) => e._id !== card._id);
                            card.owner = desList._id;
                            desList.cards.push(card);
                        }
                        url = getURL('lists/update/card/order');
                        body = JSON.stringify({
                            srcListId: srcList._id,
                            srcListOrder: newSrcOrder,
                            desListId: desList._id,
                            desListOrder: newDestOrder,
                            cardId: card._id
                        });
                    }
                }
                break;
            case DropType.Checklist:
                break;
            default:
                break;
        }
    }
    return {
        http: {
            url,
            body
        },
        newLists,
        newOrder
    };
};
