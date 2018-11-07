import { MinInfoPlayer } from '../model/player';

export interface ColPlayers {
    [uid: string]:  MinInfoPlayer;
}

export interface Game {
    gameType: string;
    Players?: ColPlayers;
}
