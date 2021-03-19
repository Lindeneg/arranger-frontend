import { Fragment, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { useForm, useHttp, Entry } from '../../common/hooks';
import { AuthContext } from '../../common/context';
import Card from '../../common/components/Interface/Card';
import Modal from '../../common/components/Interface/Modal';
import Button from '../../common/components/Interactable/Button';
import ErrorModal from '../../common/components/Interface/Modal/ErrorModal';
import Spinner from '../../common/components/Interface/Spinner';
import Input from '../../common/components/Interactable/Input';
import {
    BoardResponse,
    Functional,
    getValidator,
    ValidationType,
    OnSubmitFunc,
    devLog,
    getURL,
    BaseProps,
    BoardColor,
    getColorsWithSelectedFirst
} from '../../common/util';

export interface BoardUpdateProps {
    id: string;
    name: string;
    color: string;
}

interface BoardModalProps extends BaseProps {
    show: boolean;
    onClose: () => void;
    update?: BoardUpdateProps;
}

const BoardModal: Functional<BoardModalProps> = (props) => {
    const history = useHistory();
    const authContext = useContext(AuthContext);
    const { isLoading, error, clearError, sendRequest } = useHttp<BoardResponse<string[]>>();
    const [inputState, inputHandler, setInputState] = useForm({
        inputs: {
            name: { value: '', isValid: false },
            color: { value: BoardColor.Default, isValid: true }
        },
        isValid: false
    });

    useEffect(() => {
        const inputs: Entry = {
            name: { value: '', isValid: false },
            color: { value: BoardColor.Default, isValid: true }
        };
        if (props.update) {
            inputs.name.value = props.update.name;
            inputs.name.isValid = true;
            inputs.color.value = props.update.color;
            inputs.color.isValid = true;
        }
        setInputState({
            inputs,
            isValid: inputs.name.isValid && inputs.color.isValid
        });
    }, [props.update, setInputState]);

    const onSubmitHandler: OnSubmitFunc = async (event) => {
        event.preventDefault();
        try {
            const res: BoardResponse<string[]> | void = await sendRequest(
                getURL('boards' + (props.update ? `/${props.update.id}` : '')),
                props.update ? 'PATCH' : 'POST',
                JSON.stringify({
                    name: inputState.inputs.name.value,
                    color: inputState.inputs.color.value
                }),
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + authContext.token
                }
            );
            res && history.push('/board' + (props.update ? '' : '/' + res._id));
        } catch (err) {
            devLog(err);
        }
    };
    console.log(inputState.inputs);
    return (
        <Fragment>
            <ErrorModal show={!!error} error={error} onClear={clearError} />
            <Modal
                show={props.show && !error}
                onClose={props.onClose}
                headerText={props.update ? 'Update Board' : 'Create Board'}
                onSubmit={onSubmitHandler}
                formStyles={{ backgroundColor: '#0f3460', color: '#ccc', boxShadow: 'unset' }}
            >
                <Card style={{ backgroundColor: inputState.inputs.color.value?.toString() }}>
                    {isLoading && (
                        <Spinner style={{ backgroundColor: inputState.inputs.color.value?.toString() }} asOverlay />
                    )}
                    <Input
                        id="name"
                        onInput={inputHandler}
                        type="text"
                        label="Board Name"
                        element="input"
                        errorText="Please enter a valid name (max 12 characters)"
                        validators={[getValidator(ValidationType.Require), getValidator(ValidationType.MaxLength, 12)]}
                        value={inputState.inputs.name.value?.toString()}
                        valid={inputState.inputs.name.isValid}
                    />
                    <Input
                        id="color"
                        onInput={inputHandler}
                        type="text"
                        label="Board Color"
                        element="select"
                        selectOptions={getColorsWithSelectedFirst(inputState, props.update)}
                        selectStyle={{
                            backgroundColor: inputState.inputs.color.value?.toString() || BoardColor.Default
                        }}
                        valid={true}
                    />
                    <Button type="submit" disabled={!inputState.isValid}>
                        SUBMIT
                    </Button>
                    <Button type="button" inverse onClick={props.onClose}>
                        CANCEL
                    </Button>
                </Card>
            </Modal>
        </Fragment>
    );
};

export default BoardModal;
