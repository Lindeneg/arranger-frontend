import { MId, Requester } from '../../common/types';

export interface User extends MId {
    username: string;
    password: string;
}

export interface AuthState extends Requester {
    userId: string | null;
    token: string | null;
}

export interface AuthResponse extends Pick<AuthState, 'userId' | 'token'> {
    expires: number;
}

export interface UserPayload extends Partial<User> {}
