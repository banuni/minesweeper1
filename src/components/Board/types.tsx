export type Cell = {
    isMine: boolean,
    isRevealed: boolean,
    isFlagged: boolean,
    value?: number
}
export type Point = {
    x: number;
    y: number;
}
 export type State = {
     board: Cell[][],
     gameFinished: boolean,
     gameWon: boolean,
     totalCells: number,
     revealedCells: number
}