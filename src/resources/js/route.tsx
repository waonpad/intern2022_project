import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Switch,} from 'react-router-dom';

import Top from './pages/Top';
import Example from './pages/Example';
import About from './pages/About';
import GlobalNav from './components/GlobalNav';
import Register from './pages/Register';
import Login from './pages/Login';
import User from './pages/User';
import Page404 from './pages/Page404';

import axios, {AxiosRequestConfig, AxiosResponse, AxiosError} from 'axios';

axios.defaults.baseURL = "http://localhost:8000/";
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.post['Accept'] = 'application/json';
axios.defaults.withCredentials = true;
axios.interceptors.request.use(function(config){
    // https://stackoverflow.com/questions/69524573/why-config-headers-in-interceptor-is-possibly-undefined
    // https://stackoverflow.com/questions/70085215/how-to-fix-config-headers-authorization-object-is-possibly-undefined-when-usin
    config.headers = config.headers ?? {};
    const token = localStorage.getItem('auth_token');
    config.headers.Authorization = token ? `Bearer ${token}` : '';
    return config;
});

function App(): React.ReactElement {
    return (
        <div>
            <GlobalNav />
            <Switch>
                {/* ここに、pathと対応するコンポーネントを書いていく */}
                <Route path='/' exact component={Top} />
                <Route path='/example' exact component={Example} />
                <Route path='/about' exact component={About} />
                <Route path='/register' exact component={Register} />
                <Route path='/login' exact component={Login} />
                <Route path='/user/:id' exact component={User} />
                <Route path='*' exact component={Page404} />
            </Switch>
        </div>
    );
}

ReactDOM.render((
<BrowserRouter>
    <App />
</BrowserRouter>
), document.getElementById('app'))
