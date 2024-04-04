import { Profile } from "./profile.interface";

export interface Comment {
    _id: string;
    note: string;
    createdAt: string,
    author: Profile
}