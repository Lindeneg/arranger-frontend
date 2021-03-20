import { Fragment, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { useForm, useHttp } from '../../common/hooks';
import { AuthContext } from '../../common/context';
import Card from '../../common/components/Interface/Card';
import Button from '../../common/components/Interactable/Button';
import ErrorModal from '../../common/components/Interface/Modal/ErrorModal';
import Modal from '../../common/components/Interface/Modal';
import Spinner from '../../common/components/Interface/Spinner';
import Input from '../../common/components/Interactable/Input';
import {
    Functional,
    getValidator,
    ValidationType,
    OnSubmitFunc,
    devLog,
    getURL,
    BaseProps,
    Clickable,
    RULE,
    ListResponse,
    Visibility
} from '../../common/util';

interface ListInteractionProps extends BaseProps, Clickable, Visibility {
    owningBoardId: string;
    boardColor: string;
    update?: {
        id: string;
        name: string;
    };
}

const ListInteraction: Functional<ListInteractionProps> = (props) => {
    const history = useHistory();
    const authContext = useContext(AuthContext);
    const { isLoading, error, clearError, sendRequest } = useHttp<ListResponse<string[]>>();
    const [inputState, inputHandler, setInputState] = useForm({
        inputs: { name: { value: '', isValid: false } },
        isValid: false
    });

    useEffect(() => {
        if (props.update) {
            setInputState({
                inputs: { name: { value: props.update.name, isValid: true } },
                isValid: true
            });
        }
    }, [props.update, setInputState]);

    const onSubmitHandler: OnSubmitFunc = async (event) => {
        event.preventDefault();
        try {
            const res: ListResponse<string[]> | void = await sendRequest(
                getURL('lists' + (props.update ? `/${props.update.id}` : '')),
                props.update ? 'PATCH' : 'POST',
                JSON.stringify({
                    name: inputState.inputs.name.value,
                    owner: props.owningBoardId
                }),
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + authContext.token
                }
            );
            res && history.go(0);
        } catch (err) {
            devLog(err);
        }
    };

    return (
        <Fragment>
            <ErrorModal show={!!error} error={error} onClear={clearError} />
            <Modal
                show={props.show}
                onClose={props.onClick}
                onSubmit={onSubmitHandler}
                headerText={(props.update ? 'Update' : 'Create') + ' List'}
            >
                <Card style={{ ...props.style, backgroundColor: props.boardColor }}>
                    {isLoading && <Spinner style={{ backgroundColor: props.boardColor }} asOverlay />}
                    <Input
                        id="name"
                        onInput={inputHandler}
                        type="text"
                        label="List Name"
                        element="input"
                        errorText={`Please enter a valid name (at most ${RULE.DEFAULT_MAX_LEN} characters)`}
                        validators={[
                            getValidator(ValidationType.Require),
                            getValidator(ValidationType.MaxLength, RULE.DEFAULT_MAX_LEN)
                        ]}
                        value={inputState.inputs.name.value?.toString()}
                        valid={inputState.inputs.name.isValid}
                    />
                    <Button type="submit" disabled={!inputState.isValid}>
                        {props.update ? 'UPDATE' : 'CREATE'}
                    </Button>
                    {props.update && (
                        <Button type="button" inverse style={{float: 'right'}}>
                            DELETE
                        </Button>
                    )}
                    <Button type="button" inverse onClick={props.onClick}>
                        CANCEL
                    </Button>
                </Card>
            </Modal>
        </Fragment>
    );
};

export default ListInteraction;
