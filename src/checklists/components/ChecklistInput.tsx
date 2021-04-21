import React, { FC } from 'react';

import { ThemeOption } from '../../common';
import { CreationInput } from '../../common/components';

interface ChecklistInputProps {
    colorText: ThemeOption;
    onClose: () => void;
    onCreate: (value: string) => void;
    objective?: string;
}

const ChecklistInput: FC<ChecklistInputProps> = (props) => (
    <CreationInput
        style={{ width: '90%' }}
        type="checklist"
        inputMaxLength={80}
        iconSize="25"
        customColor={props.colorText}
        inputValue={props.objective || ''}
        placeholder="Checklist objective..."
        onClose={props.onClose}
        onCreate={props.onCreate}
        alwaysShowInput
    />
);

export default ChecklistInput;
