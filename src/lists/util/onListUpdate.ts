import { IList, ListResponse, UpdateStateAction } from '../../common/util';

export const onListUpdate = (
    order: string[],
    setOrder: (newOrder: string[]) => void,
    action: UpdateStateAction,
    list: ListResponse<string[]> | string,
    currentLists: IList[]
): IList[] => {
    const newLists = [...currentLists];
    const newOrder = [...order];
    const listId: string = typeof list === 'string' ? list : list._id;
    let updateOrder: boolean = false;
    if (action === UpdateStateAction.Create && typeof list !== 'string') {
        newLists.push({
            ...list,
            cards: []
        });
        newOrder.push(list._id);
        updateOrder = true;
    } else {
        const targetListIdx = newLists.findIndex((e) => e._id === listId);
        if (targetListIdx > -1) {
            if (action === UpdateStateAction.Update && typeof list !== 'string') {
                newLists[targetListIdx] = {
                    ...newLists[targetListIdx],
                    name: list.name
                };
            }
            if (action === UpdateStateAction.Delete) {
                const orderIdx = newOrder.findIndex((e) => e === listId);
                if (orderIdx > -1) {
                    newLists.splice(targetListIdx, 1);
                    newOrder.splice(orderIdx, 1);
                    updateOrder = true;
                }
            }
        }
    }
    if (updateOrder) {
        setOrder(newOrder);
    }
    return newLists;
};
