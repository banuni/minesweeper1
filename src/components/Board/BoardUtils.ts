import{Point, Cell} from "./types";

const pointCompare = (p1: Point, p2: Point) => {
    return (p1.x === p2.x) && (p1.y === p2.y);
};

const pointInList = (point: Point, pointList: Point[]) => {
    return pointList.some((localPoint)=>pointCompare(localPoint, point));
};

const cleanCell = {isMine: false, isRevealed: false, isFlagged: false};
const minedCell = {isMine: true, isRevealed: false, isFlagged: false};


const createMines = (rows: number, cols: number, mines: number) => {
    const minesList: Point[] = [];
    while(mines){
        const x = Math.floor(Math.random()*rows);
        const y = Math.floor(Math.random()*cols);
        if (minesList.some((point)=>pointCompare(point,{x, y}))){
            continue;
        }
        minesList.push({x, y});
        mines -= 1;
    }
    return minesList;
};

export const createBoard = (rows: number, cols: number, mines: number) => {
    const minesIndices = createMines(rows, cols, mines);
    const board = [];
    for (let x = 0; x < rows; x++){
        const row = [];
        for (let y =0; y < cols; y++) {
            row.push(Object.assign({}, pointInList({x, y}, minesIndices) ? minedCell : cleanCell))
        }
        board.push(row);
    }
    return board;
};
const getAdjCoordinates = (point: Point, board: Cell[][]) =>{
    const {x, y} = point;
    const rows = board.length;
    const cols = board[0] && board[0].length;
    const candidates = [
        {x:x+1, y:y+1},
        {x:x+1, y:y-1},
        {x:x-1, y:y+1},
        {x:x-1, y:y-1},
        {x:x+1, y:y},
        {x:x-1, y:y},
        {x:x, y:y+1},
        {x:x, y:y-1},
    ];
    return candidates.filter((candidate: Point) => {
        return candidate.x >= 0 && candidate.x < rows && candidate.y >= 0 && candidate.y < cols
    })

};

export const getCellScore = (point: Point, board: Cell[][]) => {
    const adjPoints = getAdjCoordinates(point, board);
    return adjPoints.reduce((acc: number, current: Point) => board[current.x][current.y].isMine ? acc + 1 : acc, 0)
};


// recursive
export const revealPoint3 = (point: Point, board: Cell[][]) => {
    const cell = board[point.x][point.y];
    if (cell.isRevealed){
        return board;
    }
    cell.isRevealed = true;
    const score = getCellScore(point, board);
    board[point.x][point.y].value = score;
    if (score === 0) {
        getAdjCoordinates(point, board).map((adjPoint)=>{
            revealPoint(adjPoint, board);
        })
    }
    return board;
};

// BFS
export const revealPoint = (initialPoint: Point, board: Cell[][]): number => {
    console.time("reveal");
    const queue: Point[] = [initialPoint];
    let openedCells = 0;
    while (queue.length){
        let current = queue.pop();
        const currentCell = board[current.x][current.y];
        if (currentCell.isRevealed){
            continue;
        }
        openedCells += 1;
        const score = getCellScore(current, board);
        currentCell.isRevealed = true;
        currentCell.value = score;
        if (score === 0) {
            getAdjCoordinates(current, board).map((adjPoint) => {
                if (!board[adjPoint.x][adjPoint.y].isRevealed){
                    queue.push(adjPoint);
                }
            })
        }
    }
    console.timeEnd("reveal");
    return openedCells;
};
