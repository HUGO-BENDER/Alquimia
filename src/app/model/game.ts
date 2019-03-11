import { MinInfoPlayer } from '../model/player';

export interface ColPlayers {
    [uid: string]:  MinInfoPlayer;
}

export interface ColumnGame {
    colId: string;
    id: number;
    idPlayerWin: string;
    displayNamePlayerWin: string;
    rows: Array<Card>;
}

export interface Board {
   [id: string]: ColumnGame;
}

export interface Card {
    idPlayer: string;
    displayNamePlayer: string;
    id: number;
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
    name: string;
    description?: string;
    config?: any;
    timeStart?: any;
    displayedCard?: Card;
    Players?: ColPlayers;
    Board?: Board;
    turnCont: number;
    state?: gameState;
    playerIdTurn?: string;
    IsUpdatedFinish: boolean;
}

export interface GameInProgress {
    id: string;
    isMyTurn: boolean;
    timeLastTurn: any;
}

export enum gameState {
    PLAYING,
    WAITING,
    FINISHED
}
