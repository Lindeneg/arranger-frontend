import React from 'react';

/**********************
 ****** UTILITY  ******
 **********************/

type OnClickFunc<T = HTMLElement> = React.MouseEventHandler<T>;

export interface SIndexable<T> {
    [key: string]: T;
}

export interface NIndexable<T> {
    [key: number]: T;
}

export type Login = (userId: string, responseToken: string, tokenExpire?: number) => void;

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

export type SendRequest<T> = (
    url: string,
    method?: HttpMethod,
    body?: BodyInit | null,
    headers?: HeadersInit
) => Promise<T | void>;

export type UseHttp<T> = {
    isLoading: boolean;
    error: string;
    sendRequest: SendRequest<T>;
    clearError: () => void;
};

export type Reducer<S = {}, A = Action<AnyAction>> = (state: S, action: A) => S;

export type ReducerDispatch<A, P = {}> = React.Dispatch<Action<A, P>>;

export type UseReducerTuple<S = {}, A = AnyAction, P = {}> = [S, ReducerDispatch<A, P>];

/**********************
 ****** PROPS  ********
 **********************/

export interface Identifiable {
    id: string;
}

export interface BaseProps {
    children?: React.ReactNode;
    style?: React.CSSProperties;
}

export interface OptCls {
    className?: string;
}

export interface Visibility {
    show: boolean;
}

export interface Clickable<T = HTMLElement> {
    onClick: OnClickFunc<T>;
}

/**********************
 ****  FUNCTIONAL  ****
 **********************/

export type Functional<P = BaseProps, R = JSX.Element> = (props: P) => R | null;

export type Portal<P = BaseProps> = Functional<P, React.ReactPortal>;

/**********************
 ***  CORE STRUCTS  ***
 **********************/

export interface IResponse {
    _id: string;
    createdOn: number;
    updatedOn: number;
    token?: string;
    message?: string;
}

export interface PlaceResponse extends IResponse {
    title: string;
    description: string;
    image: string;
    address: string;
    creatorId: string;
    location: Location;
}

export interface UserResponse extends IResponse {
    name: string;
    image: string;
    places: PlaceResponse[];
    lastLogin: number;
}

export interface StoredData {
    _id: string;
    _token: string;
    _expires: number;
}

/**********************
 ****** ACTIONS  ******
 **********************/

export interface Action<T, P = {}> {
    type: T;
    payload: P;
    validators?: Validator[];
}

export interface AnyAction extends Action<'any-action'> {}

/**********************
 ***** VALIDATION  ****
 **********************/

export enum ValidationType {
    Require,
    MinLength,
    MaxLength,
    MinValue,
    MaxValue
}

export type ValidationValue = string | number | undefined;

export interface Validator {
    type: ValidationType;
    value?: number;
}

export type ValidationFunc = (value: string | number, isValid: boolean, validator: Validator) => boolean;
