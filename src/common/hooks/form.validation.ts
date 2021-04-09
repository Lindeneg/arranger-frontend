import { FormValueType } from './form.hook';

export enum ValidationType {
    Require = 'isRequired',
    MinLength = 'minLength',
    MaxLength = 'maxLength',
    MinValue = 'minValue',
    MaxValue = 'maxValue',
    MinUppercaseCharacters = 'minUppercaseCharacters',
    MinNumericalSymbols = 'minNumericalSymbols',
    IsEqual = 'isEqual'
}

export interface Validator {
    type: ValidationType;
    value: FormValueType;
}

export type ValidationFunc = (value: FormValueType, isValid: boolean, validator: Validator) => boolean;

const validationFunc: { [key: string]: ValidationFunc } = {
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
    },
    [ValidationType.MinUppercaseCharacters]: (value, isValid, validator) => {
        let uppercaseChars: number = 0;
        const stringifiedValue = value.toString();
        for (let i = 0; i < stringifiedValue.length; i++) {
            let e = stringifiedValue[i];
            if (e >= 'A' && e <= 'Z') {
                uppercaseChars++;
            }
        }
        return isValid && uppercaseChars >= (validator.value || 0);
    },
    [ValidationType.MinNumericalSymbols]: (value, isValid, validator) => {
        let numericalSymbols: number = 0;
        const stringifiedValue = value.toString();
        for (let i = 0; i < stringifiedValue.length; i++) {
            let n = parseInt(stringifiedValue[i]);
            if (typeof n === 'number' && !Number.isNaN(n)) {
                numericalSymbols++;
            }
        }
        return isValid && numericalSymbols >= (validator.value || 0);
    },
    [ValidationType.IsEqual]: (value, isValid, validator) => {
        return isValid && value.toString() === validator.value?.toString();
    }
};

export const getValidator = (type: ValidationType, value: FormValueType): Validator => ({ type, value });

export const validate = (value: FormValueType, validators: Validator[]): boolean => {
    let isValid: boolean = true;
    validators.forEach((validator) => {
        const func: ValidationFunc | undefined = validationFunc[validator.type];
        if (typeof func !== 'undefined') {
            isValid = func(value, isValid, validator);
        }
    });
    return isValid;
};
