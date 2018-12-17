import { MinInfoPlayer } from '../model/player';

export interface ColPlayers {
    [uid: string]:  MinInfoPlayer;
}

export interface ColumnGame {
    colId: string;
    id: number;
    idUserWin: string;
    nameUserWin: string;
    rows: Array<Card>;
}

export interface Board {
   [id: string]: ColumnGame;
}

export interface Card {
    idPlayer: string;
    displayNamePlayer: string;
    id: string;
    idCol?: number;
    position: number;
    palo: string;
    valor: string;
    description: string;
    dragEnable?: boolean;
    classCss?: any;
    previousValues?: Card;
}

export interface Game {
    gameType: string;
    timeStart?: any;
    displayedCard?: Card;
    Players?: ColPlayers;
    Board?: Board;
    turnCont: number;
}

export interface GameInProgress {
    id: string;
    isMyTurn: boolean;
    timeLastTurn: any;
}
