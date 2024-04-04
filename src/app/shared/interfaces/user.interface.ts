export interface User {
    _id: string;
    email: string;
    username: string;
}

export interface AuthUser extends User {
    token: string
}

export type CredentialsType = Omit<User, '_id' | 'username'>;




