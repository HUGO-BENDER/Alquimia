export enum recruitmentState {
    OPEN,
    CLOSED
}

export interface InfoPlayer {
    uid: any;
    displayName: any;
}

export interface Recruitment {
    id?: string;
    gameId: string;
    dateCreation: any;
    state: recruitmentState;
    creator: InfoPlayer;
    players?: Array<InfoPlayer>;
    countPlayers: number;
    maxPlayers: number;
}
