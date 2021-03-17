import { NIndexable, ValidationFunc, ValidationType, ValidationValue, Validator } from './types';

const validationFunc: NIndexable<ValidationFunc> = {
    [ValidationType.Require]: (value, isValid, validator) => {
        return isValid && value.toString().trim().length > 0;
    },
    [ValidationType.MinLength]: (value, isValid, validator) => {
        return isValid && value.toString().trim().length >= (validator.value || 3);
    },
    [ValidationType.MaxLength]: (value, isValid, validator) => {
        return isValid && value.toString().trim().length <= (validator.value || 12);
    },
    [ValidationType.MinValue]: (value, isValid, validator) => {
        return isValid && +value >= (validator.value || 0);
    },
    [ValidationType.MaxValue]: (value, isValid, validator) => {
        return isValid && +value <= (validator.value || 10);
    }
};

export const getValidator = (type: ValidationType, value?: number): Validator => ({ type, value });

export const validate = (value: ValidationValue, validators: Validator[]): boolean => {
    let isValid: boolean = true;
    validators.forEach((validator) => {
        const func: ValidationFunc | undefined = validationFunc[validator.type];
        if (typeof func !== 'undefined') {
            isValid = func(value || '', isValid, validator);
        }
    });
    return isValid;
};
