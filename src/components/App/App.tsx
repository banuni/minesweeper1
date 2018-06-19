import * as React from 'react';
import {translate, InjectedTranslateProps} from 'react-i18next';
import * as s from './App.scss';
import * as PropTypes from 'prop-types';
import Board from "../Board/board";

interface AppProps extends InjectedTranslateProps {}

class App extends React.Component<AppProps, null> {
    static propTypes = {
        t: PropTypes.func
    };
    render() {
        const {t} = this.props;
        return (
            <div className={s.root}>
                <Board/>
            </div>
        );
    }
}

export default translate(null, {wait: true})(App);
