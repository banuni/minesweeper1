import * as React from "react";

export default class Panel extends React.Component<{startNewGame: (x:number, y:number, z:number)=>any}, {rows: number, columns: number, mines: number}> {
    constructor(props) {
        super(props);
        this.state = {rows: 7, columns: 7, mines: 7};
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        const {rows, columns, mines} = this.state;
        this.props.startNewGame(rows, columns, mines)
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    rows:
                    <input type="integer" value={this.state.rows} onChange={(e) =>{this.setState({rows: parseInt(e.target.value) || 0})}} />
                </label>
                <label>
                    <input type="integer" value={this.state.columns} onChange={(e) =>{this.setState({columns: parseInt(e.target.value) || 0})}} />
                </label>
                <label>
                    <input type="integer" value={this.state.mines} onChange={(e) =>{this.setState({mines: parseInt(e.target.value) || 0})}} />
                </label>
                <input type="submit" value="Submit" />
            </form>
        );
    }
}