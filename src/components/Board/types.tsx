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