import React, { FC } from 'react';

import { ThemeOption, themeToHex } from '../..';

const Hr: FC<{ colorText: ThemeOption }> = (props) => (
	<hr
		style={{
			borderTop: '1px solid ' + themeToHex(props.colorText),
			width: '100%'
		}}
	/>
);

export default Hr;
