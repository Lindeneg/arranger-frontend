import React, { FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import Alert from 'react-bootstrap/Alert';

import List from './List';
import { RootState } from '../../store';
import {
	updateBoardListOrder,
	updateList,
	deleteList,
	clearAnyListError
} from '../../store/actions';
import { ThemeOption, DropType, themeToHex, updateOrder } from '../../common';
import { ErrorModal } from '../../common/components';
import classes from './Lists.module.css';

interface ListsProps {
	owner: string;
	colorText: ThemeOption;
}

const Lists: FC<ListsProps> = (props) => {
	const dispatch = useDispatch();
	const { lists, error } = useSelector((state: RootState) => state.list);
	const { board } = useSelector((state: RootState) => state.board);

	const onUpdateList = (id: string, name: string): void => {
		dispatch(updateList(id, { name }));
	};

	const onDeleteList = (id: string): void => {
		dispatch(deleteList(id));
	};

	const clearError = (): void => {
		dispatch(clearAnyListError());
	};

	const onDragEnd = (result: DropResult): void => {
		if (board) {
			if (result.type === DropType.List) {
				if (result.destination && result.destination.index !== result.source.index) {
					dispatch(
						updateBoardListOrder(
							props.owner,
							updateOrder(
								[...board.listOrder],
								result.source.index,
								result.destination.index
							)
						)
					);
				}
			}
		}
	};

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<ErrorModal show={!!error} errorMessage={error} onClose={clearError} />
			<hr style={{ borderTop: '1px solid ' + themeToHex(props.colorText), width: '100%' }} />
			{lists.length > 0 && board ? (
				<Droppable direction="horizontal" droppableId={props.owner} type={DropType.List}>
					{(provided) => (
						<>
							<ul
								{...provided.droppableProps}
								ref={provided.innerRef}
								className={classes.List}
							>
								{board.listOrder.map((id, index) => {
									const list = lists.find((l) => l._id === id);
									if (list) {
										return (
											<List
												key={list._id}
												index={index}
												id={list._id}
												name={list.name}
												colorText={props.colorText}
												onUpdate={onUpdateList}
												onDelete={onDeleteList}
											/>
										);
									}
									return null;
								})}
							</ul>
							{provided.placeholder}
						</>
					)}
				</Droppable>
			) : (
				<Alert variant="info">
					No lists found. Go ahead and create one by clicking the plus icon in the
					right-corner.
				</Alert>
			)}
		</DragDropContext>
	);
};

export default Lists;
