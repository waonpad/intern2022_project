import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Switch,} from 'react-router-dom';
import Home from './pages/Home';
import Example from './pages/Example';

function App(): React.ReactElement {
    return (
        <div>
            <Switch>
                {/* ここに、pathと対応するコンポーネントを書いていく */}
                <Route path='/' exact component={Home} />
                <Route path='/example' exact component={Example} />
            </Switch>
        </div>
    );
}

ReactDOM.render((
<BrowserRouter>
    <App />
</BrowserRouter>
), document.getElementById('app'))
