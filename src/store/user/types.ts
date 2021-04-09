import { MId, Requester, ThemeOption } from '../../common/types';

export interface User extends MId {
    username: string;
    password: string;
}

export interface UserState extends Requester {
    userId: string | null;
    token: string | null;
    theme: ThemeOption;
}

export interface UserResponse extends Pick<UserState, 'userId' | 'token'> {
    expires: number;
}

export interface UserPayload extends Partial<User> {}
