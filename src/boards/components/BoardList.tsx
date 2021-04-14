import React, { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import { CheckCircle, XCircle } from 'react-bootstrap-icons';

import useForm, { getInput } from 'use-form-state';

import { RootState } from '../../store';
import { ColorSelection } from '../../common/components';
import { Board } from '../../store/boards/types';
import { negateTheme, ColorOption } from '../../common';

interface BoardListProps {
    boards: Board<string>[];
    onCreate: () => void;
    onDelete: () => void;
    onUpdate: () => void;
}

type BoardInput = { name: string; color: ColorOption };

const initialInput = () => getInput<string>('', { maxLength: 16, minLength: 1 });
const colorInput = (color: ColorOption) => getInput<ColorOption>(color, { isValid: true });

const BoardList: FC<BoardListProps> = (props) => {
    const { theme } = useSelector((state: RootState) => state.user);
    const [creatingBoard, setCreatingBoard] = useState<boolean>(false);

    const { formState, onChangeHandler, onTouchHandler, setFormState } = useForm<BoardInput>({
        name: initialInput(),
        color: colorInput(negateTheme(theme))
    });

    const onBoardCreate = (): void => {
        console.log(formState.inputs.color.value, formState.inputs.name.value);
        props.onCreate();
    };

    const onCreateBoardAccept = (): void => {
        setCreatingBoard(true);
    };

    const onCreateBoardDeny = (): void => {
        setFormState({
            ...formState.inputs,
            name: initialInput(),
            color: colorInput(negateTheme(theme))
        });
        setCreatingBoard(false);
    };

    const onSelectColor = (color: ColorOption): void => {
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
                        <ColorSelection
                            asElement={InputGroup.Prepend}
                            chosenColor={formState.inputs.color.value}
                            onSelect={onSelectColor}
                        />
                        <FormControl.Feedback type="invalid" className={'text-' + negateTheme(theme)}>
                            Board names are limited to 16 characters.
                        </FormControl.Feedback>
                    </InputGroup>
                    <CheckCircle
                        onClick={formState.isValid ? onBoardCreate : () => null}
                        role={formState.isValid ? 'button' : 'none'}
                        size="30"
                        className={'mr-1 ' + (formState.isValid ? 'text-' + negateTheme(theme) : 'text-muted')}
                    />
                    <XCircle
                        onClick={onCreateBoardDeny}
                        role="button"
                        size="30"
                        className={'ml-1 text-' + negateTheme(theme)}
                    />
                </div>
            )}
            {!creatingBoard && props.boards.length <= 0 && (
                <p className={'font-italic h6 text-' + negateTheme(theme)}>No boards found. Go ahead and create one.</p>
            )}
            {!creatingBoard && (
                <Button type="button" variant={negateTheme(theme)} onClick={onCreateBoardAccept}>
                    CREATE BOARD
                </Button>
            )}
        </Container>
    );
};

export default BoardList;
