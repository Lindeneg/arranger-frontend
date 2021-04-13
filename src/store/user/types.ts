import { MId, Requester, ThemeOption } from '../../common/types';

export interface User extends MId {
    username: string;
    password: string;
    theme?: ThemeOption;
}

export interface UserState extends Requester {
    userId: string | null;
    token: string | null;
    theme: ThemeOption;
}

export interface UserResponse extends Pick<UserState, 'userId' | 'token' | 'theme'> {
    expires: number;
}

export type UserPayload = Partial<User>;
