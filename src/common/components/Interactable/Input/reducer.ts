import InputAction from './actions';
import { InputState, InputPayload } from './';
import { validate, Action, Reducer } from '../../../util';

const reducer: Reducer<InputState, Action<InputAction, InputPayload>> = (state, action) => {
    switch (action.type) {
        case InputAction.CHANGE:
            return {
                ...state,
                value: action.payload.value,
                isValid: validate(action.payload.value, action.validators || [])
            };
        case InputAction.TOUCH:
            return {
                ...state,
                isTouched: true
            };
        default:
            return state;
    }
};

export default reducer;
