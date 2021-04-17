import React, { FC, Fragment, useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';

import { CreationInput } from '../../common/components';
import { ThemeOption } from '../../common';
import { Card } from '../../store/cards/types';

interface CardsProps {
	cards: Card[];
	cardOrder: string[];
	colorText: ThemeOption;
}

const Cards: FC<CardsProps> = (props) => {
	return (
		<Fragment>
			<ListGroup>
				<ListGroup.Item variant="dark">Cras justo odio</ListGroup.Item>
				<ListGroup.Item variant="light">Dapibus ac facilisis in</ListGroup.Item>
				<ListGroup.Item variant="primary">Morbi leo risus</ListGroup.Item>
				<ListGroup.Item variant="danger">Porta ac consectetur ac</ListGroup.Item>
				<ListGroup.Item variant="success">Vestibulum at eros</ListGroup.Item>
			</ListGroup>
			<CreationInput
				style={{ width: '90%', marginTop: '1rem' }}
				type="card"
				customColor={props.colorText}
				inputMaxLength={16}
				placeholder="Card name"
				colorSelectionDropDirection="up"
				onClose={() => null}
				onCreate={() => null}
				color
			/>
		</Fragment>
	);
};

export default Cards;
