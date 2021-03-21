import { Fragment, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import Modal from '../../common/components/Interface/Modal';
import Button from '../../common/components/Interactable/Button';
import Card from '../../common/components/Interface/Card';
import ErrorModal from '../../common/components/Interface/Modal/ErrorModal';
import Spinner from '../../common/components/Interface/Spinner';
import { useForm, useHttp, Entry } from '../../common/hooks';
import { AuthContext, ThemeContext, IAuthContext, IThemeContext } from '../../common/context';
import {
    BaseProps,
    CardResponse,
    ChecklistResponse,
    Clickable,
    Functional,
    OnSubmitFunc,
    Visibility
} from '../../common/util';
import classes from './CardModal.module.css';

interface CardModalProps extends BaseProps, Visibility, Clickable {
    cardId: string | null;
}

type FetchedCard = CardResponse<ChecklistResponse[]>;

const CardModal: Functional<CardModalProps> = (props) => {
    const history = useHistory();
    const [currentCard, setCurrentCard] = useState<FetchedCard | null>(null);
    const authContext = useContext<IAuthContext>(AuthContext);
    const themeContext = useContext<IThemeContext>(ThemeContext);
    const { isLoading, error, clearError, sendRequest } = useHttp<FetchedCard>();
    const [inputState, inputHandler, setInputState] = useForm({
        inputs: {
            name: { value: '', isValid: false },
            color: { value: themeContext.color, isValid: true }
        },
        isValid: false
    });

    useEffect(() => {
        (async () => {
            if (!!props.cardId) {
                try {
                    // fetch card
                } catch (err) {}
            }
        })();
    }, [props.cardId]);

    const onDeleteHandler = () => {
        console.log('DELETE');
    };

    const onSubmitHandler: OnSubmitFunc = (e) => {
        e.preventDefault();
        console.log('SUBMIT');
    };

    return (
        <Fragment>
            <ErrorModal show={!!error} error={error} onClear={clearError} />
            <Modal
                show={props.show && !error}
                onClose={props.onClick}
                onSubmit={onSubmitHandler}
                headerText={isLoading ? 'Loading...' : !currentCard ? 'Create Card' : '{Card Name}'}
                className={classes.Modal}
                style={{ backgroundColor: themeContext.color }}
                formStyles={{ height: '78%' }}
                contentCls={classes.Content}
                footerCls={classes.Footer}
                footerNodes={
                    isLoading ? null : (
                        <Fragment>
                            <Button type="submit">{!currentCard ? 'CREATE' : 'UPDATE'}</Button>
                            <Button onClick={props.onClick} type="button" inverse>
                                CLOSE
                            </Button>
                            <Button onClick={onDeleteHandler} type="button" inverse>
                                DELETE
                            </Button>
                        </Fragment>
                    )
                }
            >
                <Card className={classes.Card} style={{ backgroundColor: themeContext.color }}>
                    {isLoading && <Spinner asOverlay style={{ backgroundColor: themeContext.color }} />}
                    {!isLoading && <p>content...</p>}
                    {/*description*/}
                    {/*checklists...*/}
                </Card>
            </Modal>
        </Fragment>
    );
};

export default CardModal;
