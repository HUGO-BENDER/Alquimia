import { Game } from '../model/game';

export interface MinInfoPlayer {
    uid: any;
    displayName: any;
}

export interface ColActiveGames {
    [keyGame: string]:  Game;
}

export interface Player {
    uid: string;
    displayName: string;
    ActiveGames: ColActiveGames;
}
