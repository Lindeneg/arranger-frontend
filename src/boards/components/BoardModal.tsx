import { Fragment, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { useForm, useHttp } from '../../common/hooks';
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
    colorName
} from '../../common/util';

interface BoardModalProps extends BaseProps {
    show: boolean;
    onClose: () => void;
}

const BoardModal: Functional<BoardModalProps> = (props) => {
    const history = useHistory();
    const authContext = useContext(AuthContext);
    const { isLoading, error, clearError, sendRequest } = useHttp<BoardResponse<string[], string[], string[]>>();
    const [inputState, inputHandler] = useForm({
        inputs: {
            name: { value: '', isValid: false },
            color: { value: '', isValid: true }
        },
        isValid: false
    });

    const onSubmitHandler: OnSubmitFunc = async (event) => {
        event.preventDefault();
        try {
            const res: BoardResponse<string[], string[], string[]> | void = await sendRequest(
                getURL('boards'),
                'POST',
                JSON.stringify({
                    name: inputState.inputs.name.value,
                    color: inputState.inputs.color.value || BoardColor.Default
                }),
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + authContext.token
                }
            );
            res && history.push('/board/' + res._id);
        } catch (err) {
            devLog(err);
        }
    };

    return (
        <Fragment>
            <ErrorModal show={!!error} error={error} onClear={clearError} />
            <Modal
                show={props.show && !error}
                onClose={props.onClose}
                headerText="Create Board"
                onSubmit={onSubmitHandler}
                formStyles={{ backgroundColor: '#0f3460', color: '#ccc', boxShadow: 'unset' }}
            >
                <Card
                    style={{
                        backgroundColor: inputState.inputs.color.value
                            ? inputState.inputs.color.value.toString()
                            : BoardColor.Default
                    }}
                >
                    {isLoading && <Spinner asOverlay />}
                    <Input
                        id="name"
                        onInput={inputHandler}
                        type="text"
                        label="Board Name"
                        element="input"
                        errorText="Please enter a valid name (max 12 characters)"
                        validators={[getValidator(ValidationType.Require), getValidator(ValidationType.MaxLength, 12)]}
                    />
                    <Input
                        id="color"
                        onInput={inputHandler}
                        type="text"
                        label="Board Color"
                        element="select"
                        selectOptions={Object.keys(colorName).map((key) => ({
                            bg: key,
                            value: key,
                            c: '#ccc'
                        }))}
                        selectStyle={{
                            backgroundColor: inputState.inputs.color.value
                                ? inputState.inputs.color.value.toString()
                                : BoardColor.Default
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
