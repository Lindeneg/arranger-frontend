import React, { FC, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import FormControl from 'react-bootstrap/FormControl';
import { CheckCircle, XCircle } from 'react-bootstrap-icons';

import useForm, { getInput } from 'use-form-state';

import { Board } from '../../store/boards/types';
import { defaultTheme, negateTheme } from '../../common';

interface BoardListProps {
    boards: Board<string>[];
    onCreate: () => void;
    onDelete: () => void;
    onUpdate: () => void;
}

type BoardInput = { name: string; color: string };

const initialInput = () => getInput<string>('', { maxLength: 16, minLength: 1 });
const colorInput = (color: string = negateTheme(defaultTheme)) => getInput<string>(color, { isValid: true });

const BoardList: FC<BoardListProps> = (props) => {
    const [creatingBoard, setCreatingBoard] = useState<boolean>(false);

    const { formState, onChangeHandler, onTouchHandler, setFormState } = useForm<BoardInput>({
        name: initialInput(),
        color: colorInput()
    });

    const onBoardCreate = (): void => {
        console.log(formState.inputs);
        props.onCreate();
    };

    const onCreateBoardAccept = (): void => {
        setCreatingBoard(true);
    };

    const onCreateBoardDeny = (): void => {
        setFormState({
            ...formState.inputs,
            name: initialInput()
        });
        setCreatingBoard(false);
    };

    const onSelectColor = (color: string): void => {
        setFormState({
            ...formState.inputs,
            color: colorInput(color)
        });
    };

    return (
        <Container>
            {props.boards.map((board) => (
                <div>board {board._id}</div>
            ))}
            {creatingBoard && (
                <div style={{ width: '18rem' }}>
                    <InputGroup className="mb-2">
                        <FormControl
                            id="name"
                            isInvalid={formState.inputs.name.isTouched && !formState.inputs.name.isValid}
                            isValid={formState.inputs.name.isValid}
                            onChange={onChangeHandler}
                            onBlur={onTouchHandler}
                            placeholder="Board name..."
                            aria-describedby="boardNameHelpBlock"
                        />
                        <DropdownButton
                            as={InputGroup.Prepend}
                            variant={formState.inputs.color.value}
                            title="Color"
                            id="input-group-dropdown-1"
                        >
                            <Dropdown.Item
                                onSelect={(e, i) => {
                                    i.preventDefault();
                                    console.log(e);
                                }}
                                href="asf"
                                className="bg-danger text-light"
                            >
                                Dark
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item href="#">Another action</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item href="#">Something else here</Dropdown.Item>
                            <Dropdown.Divider />
                        </DropdownButton>
                        <FormControl.Feedback type="invalid">
                            Board names are limited to 16 characters.
                        </FormControl.Feedback>
                    </InputGroup>
                    <CheckCircle
                        onClick={formState.isValid ? onBoardCreate : () => null}
                        role={formState.isValid ? 'button' : 'none'}
                        size="30"
                        className={'mr-1 ' + (formState.isValid ? '' : 'text-muted')}
                    />
                    <XCircle onClick={onCreateBoardDeny} role="button" size="30" className="ml-1" />
                </div>
            )}
            {!creatingBoard && (
                <Button type="button" variant="light" onClick={onCreateBoardAccept}>
                    CREATE BOARD
                </Button>
            )}
        </Container>
    );
};

export default BoardList;
