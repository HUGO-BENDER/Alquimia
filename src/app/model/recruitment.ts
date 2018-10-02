import { MinInfoPlayer } from '../model/player';

export enum recruitmentState {
    OPEN,
    CLOSED
}

export interface Recruitment {
    id?: string;
    gameType: string;
    dateCreation: any;
    state: recruitmentState;
    creator: MinInfoPlayer;
    players?: Array<MinInfoPlayer>;
    countPlayers: number;
    maxPlayers: number;
}
