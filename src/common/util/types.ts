import React from 'react';

/**********************
 ****** UTILITY  ******
 **********************/

type SArrUnion<T> = string[] | T[];

export type DraggableConstraint = HTMLLIElement | HTMLDivElement;

export type OnSubmitFunc<T = HTMLFormElement> = React.FormEventHandler<T>;

export type OnClickFunc<T = HTMLElement, O = any> = (event: React.MouseEvent<T, MouseEvent>, opt?: O) => void;

export type OnChange<T = HTMLElement> = React.ChangeEventHandler<T>;

export type OnBlur<T = HTMLElement> = React.FocusEventHandler<T>;

export type DragEventHandler<T> = React.DragEventHandler<T>;

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

export interface Clickable<T = HTMLElement, O = any> {
    onClick: OnClickFunc<T, O>;
}

/**********************
 ****  FUNCTIONAL  ****
 **********************/

export type Functional<P = BaseProps, R = JSX.Element> = (props: P) => R | null;

export type Portal<P = BaseProps> = Functional<P, React.ReactPortal>;

/**********************
 ***  CORE STRUCTS  ***
 **********************/

interface Ownership {
    owner: string;
    indirectOwner: string;
}

export interface IResponse {
    _id: string;
    name: string;
    createdOn?: number;
    updatedOn?: number;
    message?: string;
}

export interface Orderable {
    order: string[];
}

export interface UserAuthResponse {
    _id: string;
    token: string;
}

export interface BoardResponse<LI extends SArrUnion<ListResponse<SArrUnion<CardResponse<string[]>>>>>
    extends IResponse,
        Orderable {
    color: string;
    owner: string;
    lists: LI;
}

export interface ListResponse<CA extends SArrUnion<CardResponse<string[]>>> extends IResponse, Ownership, Orderable {
    cards: CA;
}

export interface CardResponse<CH extends SArrUnion<ChecklistResponse>> extends IResponse, Ownership {
    color: string;
    description: string;
    checklists: CH;
}

export interface ChecklistResponse extends IResponse, Ownership {
    description: string;
    isCompleted: boolean;
}

export interface StoredData {
    _id: string;
    _token: string;
    _expires: number;
}

export interface DeleteResponse {
    message: string;
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
