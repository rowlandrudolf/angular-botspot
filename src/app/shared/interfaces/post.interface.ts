import { Profile } from "./profile.interface";

export interface Post {
    _id: string;
    body: string;
    createdAt: string;
    author: Profile;
    likesCount: number;
    likedUsers: string[];
    liked: boolean;
    comments: []
}
