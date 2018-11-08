import { MinInfoPlayer } from '../model/player';

export interface ColPlayers {
    [uid: string]:  MinInfoPlayer;
}

export interface ColumnGame {
    id: string;
    idUserWin: string;
    nameUserWin: string;
}

export interface Board {
   [id: string]: ColumnGame;
}

export interface Card {
    id: string;
    position: number;
    palo: string;
    valor: string;
    description: string;
    dragEnable: boolean;
    dropEnable: boolean;
    classCss: string;
}

export interface Game {
    gameType: string;
    timeStart?: any;
    displayedCard?: Card;
    Players?: ColPlayers;
    Board?: Board;
}

export interface GameInProgress {
    id: string;
    isMyTurn: boolean;
    timeLastTurn: any;
}
