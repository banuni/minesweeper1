import * as React from 'react';
import classnames from 'classnames'

import CellView from './cell'
import Panel from "../Panel/panel";
import {createBoard, revealPoint} from './BoardUtils'
import {Cell, Point} from "./types";

import * as s from './board.scss';

const DEFAULTS = {rows: 7, cols: 7, mines: 7};

export default class Board extends React.PureComponent<null, {board: Cell[][], gameFinished: boolean, gameWon: boolean, totalCells: number, revealedCells: number}> {
    constructor() {
        super();
        this.state = {
            board: createBoard(DEFAULTS.rows, DEFAULTS.cols, DEFAULTS.mines),
            gameFinished: false,
            gameWon: false,
            totalCells: DEFAULTS.rows * DEFAULTS.cols - DEFAULTS.mines,
            revealedCells: 0
        };
        this.startNewGame = this.startNewGame.bind(this);
        this.onCellClick = this.onCellClick.bind(this);
    }
    startNewGame(rows: number, columns: number, mines: number){
        const newBoard = createBoard(rows, columns, mines);
        this.setState({
            board: newBoard,
            gameFinished: false,
            gameWon: false,
            totalCells: rows * columns - mines,
            revealedCells: 0
        })
    }

    onCellClick(point: Point, longPress: boolean): void {
        const lastBoard = this.state.board;
        const {gameFinished} = this.state;
        const clickedCell = lastBoard[point.x][point.y];
        if (gameFinished || clickedCell.isRevealed) {
            return;
        }
        if (longPress) {
            let newBoard = lastBoard;
            newBoard[point.x][point.y].isFlagged = !clickedCell.isFlagged;
            this.setState({
                board: newBoard
            })
        }
        else if (!clickedCell.isFlagged && clickedCell.isMine) {
            let newBoard = lastBoard;
            newBoard[point.x][point.y].isRevealed = true;
            this.setState({
                board: newBoard,
                gameFinished: true
            })

        } else if (!clickedCell.isFlagged){
            const {revealedCells, totalCells} = this.state;
            let newRevealedCells = revealedCells + revealPoint(point, lastBoard);

            let didWin = totalCells === newRevealedCells;
            this.setState({
                gameWon: didWin,
                gameFinished: didWin,
                revealedCells: newRevealedCells
            })
        }
    };

    render() {
        const {gameWon, gameFinished} = this.state;
        let gameState = "game is in progress";
        if (gameWon){
            gameState = "Winner Winner Chicken Dinner"
        } else if (gameFinished) {
            gameState = "You Lose. Basush"
        }
        const boardClasses = classnames(s.board, {[s.gameOver]: gameFinished});
        return (
            <div className={boardClasses}>
                {gameState}
                {this.state.board.map((row, x) => (
                    <div className={s.row} key={x}>
                        {row.map((cell: Cell, y: number) => (
                            <CellView key={y}
                                      onClickCheckLong={this.onCellClick}
                                      x={x}
                                      y={y}
                                      {...cell}/>
                        ))}
                        <br/>
                    </div>
                ))}
                <Panel
                    startNewGame={this.startNewGame}
                />
            </div>
        )
    }
};