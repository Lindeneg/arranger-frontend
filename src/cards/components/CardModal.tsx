import { Fragment, useCallback, useContext, useEffect, useState } from 'react';

import { onInternalListUpdate, ListCardAction } from '../util/onListUpdate';
import Checklists from '../../checklists/components';
import Modal from '../../common/components/Interface/Modal';
import Button from '../../common/components/Interactable/Button';
import Input from '../../common/components/Interactable/Input';
import Card from '../../common/components/Interface/Card';
import ErrorModal from '../../common/components/Interface/Modal/ErrorModal';
import Spinner from '../../common/components/Interface/Spinner';
import { useForm, useHttp } from '../../common/hooks';
import { AuthContext, ThemeContext, IAuthContext, IThemeContext } from '../../common/context';
import {
    BaseProps,
    CardResponse,
    ChecklistResponse,
    Clickable,
    devLog,
    Functional,
    getURL,
    getValidator,
    ListUpdatable,
    OnSubmitFunc,
    RULE,
    ValidationType,
    Visibility
} from '../../common/util';
import classes from './CardModal.module.css';

interface CardModalProps extends BaseProps, Visibility, Clickable, ListUpdatable {
    listOwnerId: string;
    cardId: string | null;
}

type FetchedCard = CardResponse<ChecklistResponse[]>;

const CardModal: Functional<CardModalProps> = (props) => {
    const authContext = useContext<IAuthContext>(AuthContext);
    const themeContext = useContext<IThemeContext>(ThemeContext);
    const [currentCard, setCurrentCard] = useState<FetchedCard | null>(null);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const { isLoading, error, clearError, sendRequest } = useHttp<FetchedCard>();
    const [inputState, inputHandler, setInputState] = useForm({
        inputs: {
            name: { value: '', isValid: false },
            description: { value: '', isValid: false }
        },
        isValid: false
    });

    const setCard = useCallback(
        (card: FetchedCard) => {
            setCurrentCard(card);
            setInputState({
                inputs: {
                    name: { value: card.name, isValid: true },
                    description: { value: card.description, isValid: true }
                },
                isValid: true
            });
        },
        [setInputState]
    );

    useEffect(() => {
        (async () => {
            if (!!props.cardId) {
                try {
                    const res: FetchedCard | void = await sendRequest(getURL('cards/' + props.cardId), 'GET', null, {
                        Authorization: 'Bearer ' + authContext.token
                    });
                    res && setCard(res);
                } catch (err) {
                    devLog(err);
                }
            }
        })();
    }, [props.cardId, authContext.token, sendRequest, setInputState, setCard]);

    const onClose = () => {
        setCurrentCard(null);
        setIsDeleting(false);
        setIsEditing(false);
        setInputState({
            inputs: {
                name: { value: '', isValid: false },
                description: { value: '', isValid: false }
            },
            isValid: false
        });
        props.onClick();
    };

    const onDeleteAccept = () => {
        setIsDeleting(true);
    };

    const onDeleteDeny = () => {
        setIsDeleting(false);
    };

    const onEditAccept = () => {
        setIsEditing(true);
        if (!!currentCard) {
            setInputState({
                inputs: {
                    name: { value: currentCard.name, isValid: true },
                    description: { value: currentCard.description, isValid: true }
                },
                isValid: true
            });
        }
    };

    const onEditDeny = () => {
        setInputState({
            inputs: {
                name: { value: currentCard?.name || '', isValid: !!currentCard },
                description: { value: currentCard?.description || '', isValid: !!currentCard }
            },
            isValid: !!currentCard
        });
        setIsEditing(false);
    };

    const onDeleteHandler = async () => {
        if (!!currentCard) {
            try {
                const res: FetchedCard | void = await sendRequest(getURL(`cards/${currentCard._id}`), 'DELETE', null, {
                    Authorization: 'Bearer ' + authContext.token
                });
                if (res) {
                    props.updateLists(onInternalListUpdate.bind(null, ListCardAction.Delete, currentCard));
                    onClose();
                }
            } catch (err) {
                devLog(err);
            }
        }
    };

    const onSubmitHandler: OnSubmitFunc = async (e) => {
        e.preventDefault();
        try {
            const res: FetchedCard | void = await sendRequest(
                getURL('cards' + (!!currentCard ? `/${currentCard?._id}` : '')),
                !!currentCard ? 'PATCH' : 'POST',
                JSON.stringify({
                    name: inputState.inputs.name.value,
                    description: inputState.inputs.description.value,
                    owner: props.listOwnerId,
                    color: 'none' // currently not used
                }),
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + authContext.token
                }
            );
            if (res) {
                setCard(res);
                props.updateLists(
                    onInternalListUpdate.bind(null, !!currentCard ? ListCardAction.Update : ListCardAction.Create, res)
                );
                onEditDeny();
            }
        } catch (err) {
            devLog(err);
        }
    };

    return (
        <Fragment>
            <ErrorModal show={!!error} error={error} onClear={clearError} />
            <Modal
                show={props.show && !error}
                onClose={onClose}
                onSubmit={onSubmitHandler}
                headerText={isLoading ? 'Loading...' : !currentCard ? 'Create Card' : currentCard.name}
                className={classes.Modal}
                style={{ backgroundColor: themeContext.color }}
                formStyles={{ height: '78%' }}
                contentCls={!!currentCard ? classes.ContentDefault : classes.ContentInitial}
                footerCls={classes.Footer}
                footerNodes={
                    isLoading ? null : isDeleting ? (
                        <div className={classes.FooterDelete}>
                            <Button inverse onClick={onDeleteHandler} type="button">
                                CONFIRM DELETE
                            </Button>
                            <Button onClick={onDeleteDeny} type="button">
                                CANCEL DELETE
                            </Button>
                        </div>
                    ) : (
                        <Fragment>
                            {!currentCard && (
                                <Button disabled={!inputState.isValid} type={!!currentCard ? 'button' : 'submit'}>
                                    CREATE CARD
                                </Button>
                            )}
                            <Button onClick={onClose} type="button" inverse>
                                CLOSE CARD
                            </Button>
                            {!!currentCard && (
                                <Button onClick={onDeleteAccept} type="button" inverse>
                                    DELETE CARD
                                </Button>
                            )}
                        </Fragment>
                    )
                }
            >
                {isLoading && <Spinner asOverlay style={{ backgroundColor: themeContext.color }} />}
                {!isLoading && (
                    <Card className={classes.Card} style={{ backgroundColor: themeContext.color }}>
                        {!currentCard || isEditing ? (
                            <Fragment>
                                <Input
                                    placeHolder={'Enter Name...'}
                                    id="name"
                                    label="Name"
                                    type="text"
                                    element="input"
                                    onInput={inputHandler}
                                    className={classes.Name}
                                    value={inputState.inputs.name.value?.toString() || ''}
                                    valid={inputState.inputs.name.isValid || false}
                                    validators={[
                                        getValidator(ValidationType.Require),
                                        getValidator(ValidationType.MaxLength, RULE.USR_MAX_LEN)
                                    ]}
                                />
                                <Input
                                    placeHolder={'Enter Description...'}
                                    id="description"
                                    label="Description"
                                    resize="none"
                                    type="text"
                                    element="text-area"
                                    onInput={inputHandler}
                                    className={classes.Description}
                                    value={inputState.inputs.description.value?.toString() || ''}
                                    valid={inputState.inputs.description.isValid || false}
                                    validators={[
                                        getValidator(ValidationType.Require),
                                        getValidator(ValidationType.MaxLength, RULE.DES_MAX_LEN)
                                    ]}
                                />
                                {isEditing && (
                                    <Fragment>
                                        <Button type="submit" style={{ width: '100%', marginBottom: '0.5rem' }}>
                                            SAVE
                                        </Button>
                                        <Button
                                            onClick={onEditDeny}
                                            style={{ width: '100%', marginBottom: '1rem' }}
                                            inverse
                                        >
                                            CANCEL
                                        </Button>
                                    </Fragment>
                                )}
                            </Fragment>
                        ) : (
                            <div onClick={onEditAccept} className={classes.DescriptionAlt}>
                                <p>{currentCard.description}</p>
                            </div>
                        )}
                        <hr />
                        {!!currentCard && !isEditing && <Checklists checklists={currentCard.checklists} />}
                    </Card>
                )}
            </Modal>
        </Fragment>
    );
};

export default CardModal;
