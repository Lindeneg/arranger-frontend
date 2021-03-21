import { useState, useCallback } from 'react';

import { DragEventHandler, DraggableConstraint } from '../util';


export interface IDragDropHook<T> {
    currentDes: string | null;
    onDragOver: DragEventHandler<T>;
    onDragEnd: DragEventHandler<T>;
}

export function useDragDrop<T extends DraggableConstraint>(
    preOrder: string[],
    updateHandler: (postOrder: string[]) => void
): IDragDropHook<T> {
    const [dragDes, setDragDes] = useState<string | null>(null);

    const onDropHandler = useCallback(
        (src: string, des: string) => {
            if (des !== src) {
                const result = preOrder.filter((e) => e !== src);
                const desIdx = preOrder.findIndex((e) => e === des);
                if (desIdx > -1) {
                    result.splice(desIdx, 0, src);
                    updateHandler(result);
                }
            }
        },
        [preOrder, updateHandler]
    );

    const onDragEnd: DragEventHandler<T> = useCallback(
        (e) => {
            e.stopPropagation();
            if (dragDes !== null) {
                onDropHandler(e.currentTarget.id, dragDes);
            }
            setDragDes(null);
        },
        [dragDes, onDropHandler]
    );

    const onDragOver: DragEventHandler<T> = useCallback((e) => {
        e.preventDefault();
        setDragDes(e.currentTarget.id);
    }, []);

    return { onDragOver, onDragEnd, currentDes: dragDes };
}
