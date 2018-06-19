import * as React from "react";
import ClickNHold from 'react-click-n-hold';
import * as s from "./board.scss";
import classnames from 'classnames'

type cellProps = {
    isRevealed: boolean,
    isMine: boolean,
    isFlagged: boolean,
    x: number,
    y: number,
    onClickCheckLong: any
    value?: any,
}

export default class CellView extends React.PureComponent<cellProps, any> {
    shouldComponentUpdate(newProps) {
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
}