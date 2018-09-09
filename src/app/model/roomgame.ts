export enum gamestate {
    OPEN,
    START,
    END
}

export interface Roomgame {
    gameId: string;
    dateCreation: any;
    state: gamestate;
    creator: {uid: any, displayName: any};
    opponent?: {uid: any, displayName: any};
}
