import Modal from '../';
import Button from '../../../Interactable/Button';
import { Functional, BaseProps, OnClickFunc } from '../../../../util';

interface ErrorModalProps extends BaseProps {
    onClear: OnClickFunc;
    error: string;
    show: boolean;
}

const ErrorModal: Functional<ErrorModalProps> = (props) => {
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
