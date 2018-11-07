import { GameInProgress } from '../model/game';

export interface MinInfoPlayer {
    uid: any;
    displayName: any;
}

export interface ColGamesInProgress {
    [keyGame: string]:  GameInProgress;

}

export interface Player {
    uid: string;
    displayName: string;
    GamesInProgress: ColGamesInProgress;
}
