import React, { FC, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Alert from 'react-bootstrap/Alert';

import List from './List';
import { RootState } from '../../store';
import { updateList, deleteList, clearAnyListError } from '../../store/actions';
import { ThemeOption, themeToHex } from '../../common';
import { ErrorModal } from '../../common/components';
import classes from './Lists.module.css';

interface ListsProps {
	colorText: ThemeOption;
}

const Lists: FC<ListsProps> = (props) => {
	const dispatch = useDispatch();
	const { lists, error } = useSelector((state: RootState) => state.list);

	const onUpdateList = (id: string, name: string): void => {
		dispatch(updateList(id, { name }));
	};

	const onDeleteList = (id: string): void => {
		dispatch(deleteList(id));
	};

	const clearError = (): void => {
		dispatch(clearAnyListError());
	};

	return (
		<Fragment>
			<ErrorModal show={!!error} errorMessage={error} onClose={clearError} />
			<hr style={{ borderTop: '1px solid ' + themeToHex(props.colorText), width: '100%' }} />
			{lists.length > 0 ? (
				<ul className={classes.List}>
					{lists.map((list, index) => (
						<List
							key={index}
							id={list._id}
							name={list.name}
							colorText={props.colorText}
							onUpdate={onUpdateList}
							onDelete={onDeleteList}
						/>
					))}
				</ul>
			) : (
				<Alert variant="info">
					No lists found. Go ahead and create one by clicking the plus icon in the
					right-corner.
				</Alert>
			)}
		</Fragment>
	);
};

export default Lists;
