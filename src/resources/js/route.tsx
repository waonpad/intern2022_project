import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Switch, Link} from 'react-router-dom';

import Top from './pages/Top';
import Example from './pages/Example';
import About from './pages/About';
import Register from './pages/Register';
import Login from './pages/Login';
import User from './pages/User';
import Chat from './pages/Chat';
import PrivateChat from './pages/PrivateChat';
import GroupChat from './pages/GroupChat';
import Header from './components/Header';
import Page404 from './pages/Page404';

import AxiosInterceptors from './contexts/AxiosInterceptors';
import ProvideAuth, { PrivateRoute, PublicRoute } from './contexts/AuthContext'
import ProvideNoification from './contexts/NotificationContext';

function App(): React.ReactElement {
    return (
        <AxiosInterceptors>
            <ProvideAuth> 
                <ProvideNoification>
                    <BrowserRouter>
                        <Header>
                            <Switch>
                                <Route path='/' exact component={Top} />
                                <Route path='/example' exact component={Example} />
                                <PrivateRoute path='/about' exact><About/></PrivateRoute>
                                <PublicRoute path='/register' exact><Register/></PublicRoute>
                                <PublicRoute path='/login' exact><Login/></PublicRoute>
                                <Route path='/user/:id' exact component={User} />
                                <PrivateRoute key={'index'} path='/chat' exact><Chat/></PrivateRoute>
                                <PrivateRoute path='/privatechat/:id' exact><PrivateChat/></PrivateRoute>
                                <PrivateRoute path='/groupchat/:id' exact><GroupChat/></PrivateRoute>
                                <PrivateRoute key={'category'} path='/category/:category_id' exact><Chat/></PrivateRoute>
                                <Route path='*' exact component={Page404} />
                            </Switch>
                        </Header>
                    </BrowserRouter>
                </ProvideNoification>
            </ProvideAuth>
        </AxiosInterceptors>
    );
}

ReactDOM.render((
    <App />
), document.getElementById('app'))
