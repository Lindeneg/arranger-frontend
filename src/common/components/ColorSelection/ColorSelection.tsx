import React, { FC } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { ColorOption, getCls, getColorText, colorClassMap } from '../../';

interface ColorSelectionProps {
    chosenColor: ColorOption;
    asElement: React.ElementType;
    onSelect: (color: ColorOption) => void;
    direction: 'up' | 'left' | 'right' | 'down';
}

const ColorSelection: FC<ColorSelectionProps> = (props) => (
    <Dropdown drop={props.direction}>
        <DropdownButton
            as={props.asElement}
            variant={colorClassMap[props.chosenColor]}
            title="Color"
            id="input-group-dropdown-1"
        >
            {Object.keys(colorClassMap).map((key, index) => {
                const color = colorClassMap[key as ColorOption];
                return (
                    <Dropdown.Item
                        key={index}
                        onSelect={(e, i) => {
                            i.preventDefault();
                            props.onSelect(key as ColorOption);
                        }}
                        className={getCls(
                            'bg-' + color,
                            'text-' + getColorText(key as ColorOption)
                        )}
                    >
                        {key[0].toUpperCase() + key.substr(1)}
                    </Dropdown.Item>
                );
            })}
        </DropdownButton>
    </Dropdown>
);

export default ColorSelection;
