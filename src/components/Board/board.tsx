import * as React from 'react';
import {createBoard, revealPoint} from './BoardUtils'
import {Point, Cell} from "./types";
import ClickNHold from 'react-click-n-hold'
import classnames from 'classnames'

import * as s from './board.scss';

import './board.scss';
import Panel from "../Panel/panel";

const DEFAULTS = {rows: 7, cols: 7, mines: 7};

class CellView extends React.PureComponent<{isRevealed: boolean, isMine: boolean, isFlagged: boolean, value: string, x: number, y: number, onClickCheckLong: Function}, any> {
    shouldComponentUpdate(newProps){
        return (this.props.isRevealed !== newProps.isRevealed) || (this.props.isFlagged !== newProps.isFlagged);
    }

    render() {
        const {value, isRevealed, isMine, isFlagged} = this.props;
        let displayValue = '';
        if (isFlagged) {
            displayValue = '$';
        }
        else if (isMine) {
            displayValue = isRevealed ? 'X' : '*';
        } else if (isRevealed) {
            displayValue = value;
        }
        const classes = classnames(s.cell, {[s.revealed]: isRevealed});

        const onClickCheckLong = (e, enough) => {
            const {x, y} = this.props;
            this.props.onClickCheckLong({x, y}, enough)
        };

        return (
            <ClickNHold className={classes}
                        time={0.2}
                        onEnd={onClickCheckLong}
            >
                    <span>
                        {displayValue}
                    </span>
            </ClickNHold>
        );
    }
};



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
                        {row.map((cell, y) => (
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