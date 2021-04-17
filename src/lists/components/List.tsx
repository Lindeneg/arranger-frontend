import React, { FC, Fragment, useState } from 'react';
import { Trash } from 'react-bootstrap-icons';

import { ThemeOption, getCls } from '../../common';
import { CreationInput, ConfirmModal } from '../../common/components';
import classes from './Lists.module.css';

interface ListProps {
	id: string;
	name: string;
	colorText: ThemeOption;
	onUpdate: (id: string, name: string) => void;
	onDelete: (id: string) => void;
}

const List: FC<ListProps> = (props) => {
	const [deleting, setDeleting] = useState<boolean>(false);
	const [editing, setEditing] = useState<boolean>(false);

	const onUpdate = (name: string): void => {
		if (name !== props.name) {
			props.onUpdate(props.id, name);
		}
	};

	return (
		<Fragment>
			<ConfirmModal
				show={deleting}
				onClose={() => setDeleting(false)}
				onConfirm={props.onDelete.bind(null, props.id)}
				headerTxt="Confirm List Deletion"
			/>
			<li style={{ height: '100%' }}>
				<div style={{ height: '100%' }}>
					<div
						className={getCls(classes.Item, classes.Wrapper, 'text-' + props.colorText)}
					>
						<div className={classes.Header}>
							{editing ? (
								<CreationInput
									type="list"
									inputMaxLength={16}
									customColor={props.colorText}
									placeholder="List name"
									inputValue={props.name}
									onClose={() => setEditing(false)}
									onCreate={onUpdate}
									alwaysShowInput={true}
								/>
							) : (
								<Fragment>
									<h3 onClick={() => setEditing(true)} className={classes.Name}>
										{props.name}
									</h3>
									<Trash
										role="button"
										size="20"
										onClick={() => setDeleting(true)}
									/>
								</Fragment>
							)}
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
		</Fragment>
	);
};

export default List;
