import React, { FC, Fragment, useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { PlusCircle, Circle, CheckCircle } from 'react-bootstrap-icons';

import { Checklist as ChecklistType } from '../../store/checklists/types';

const Checklist: FC<ChecklistType> = (props) => {
	return (
		<div className="d-flex align-items-baseline justify-content-between">
			<ListGroup.Item
				className="mb-3"
				style={{
					backgroundColor: 'transparent',
					width: '60%',
					wordBreak: 'break-all',
					fontStyle: props.isCompleted ? 'italic' : '',
					textDecoration: props.isCompleted ? 'line-through' : ''
				}}
			>
				{props.objective}
			</ListGroup.Item>
			{props.isCompleted ? (
				<CheckCircle role="button" size="25" />
			) : (
				<Circle role="button" size="25" />
			)}
		</div>
	);
};

export default Checklist;
