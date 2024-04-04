export interface Profile {
    _id: string | null,
    username: string,
    following: boolean,
    followersCount: number,
    followingCount: number,
}