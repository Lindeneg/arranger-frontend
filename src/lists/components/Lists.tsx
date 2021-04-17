import React, { FC, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Alert from 'react-bootstrap/Alert';

import { RootState } from '../../store';
import { ThemeOption, themeToHex, getCls } from '../../common';
import { CreationInput, ErrorModal } from '../../common/components';
import classes from './Lists.module.css';

interface ListsProps {
	colorText: ThemeOption;
}

const Lists: FC<ListsProps> = (props) => {
	const { lists, error } = useSelector((state: RootState) => state.list);

	const createList = (): void => {
		// todo
	};

	const updateList = (): void => {
		// todo
	};

	const deleteList = (): void => {
		// todo
	};

	const clearError = (): void => {
		// todo
	};

	return (
		<Fragment>
			<ErrorModal show={!!error} errorMessage={error} onClose={clearError} />
			<hr style={{ borderTop: '1px solid ' + themeToHex(props.colorText), width: '100%' }} />

			<ul className={classes.List}>
				{[{ name: 'Not Started' }, { name: 'In Progress' }].map((list, index) => (
					<li key={index} style={{ height: '100%' }}>
						<div style={{ height: '100%' }}>
							<div
								className={getCls(
									classes.Item,
									classes.Wrapper,
									'text-' + props.colorText
								)}
							>
								<div className={classes.Header}>
									<h3>{list.name}</h3>
								</div>
								<hr
									style={{
										marginTop: '0',
										border: '1px solid rgb(99, 99, 99)'
									}}
								/>
								{/* LIST CARDS */}
							</div>
						</div>
					</li>
				))}
			</ul>

			{lists.length <= 0 && (
				<Alert variant="info">
					No lists found. Go ahead and create one by clicking the plus icon in the
					right-corner.
				</Alert>
			)}
		</Fragment>
	);
};

export default Lists;
