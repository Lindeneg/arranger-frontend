import Modal from '../';
import Button from '../../../Interactable/Button';
import { Functional, BaseProps, OnClickFunc } from '../../../../util';

interface ErrorModalProps extends BaseProps {
    onClear: OnClickFunc;
    error: string;
    show: boolean;
}

/**
 * Error-specific Modal. Used for HTTP exceptions.
 */

const ErrorModal: Functional<ErrorModalProps> = (props) => {
    console.log('You need to login to perform the desired action.' === props.error);
    return (
        <Modal
            onClose={props.onClear}
            headerText="An Error Occurred!"
            show={props.show}
            footerNodes={<Button onClick={props.onClear}>Okay</Button>}
        >
            <p>{props.error}</p>
        </Modal>
    );
};

export default ErrorModal;
