import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Card } from '@material-ui/core';
import { Link, useHistory } from "react-router-dom";
import axios from 'axios';
import swal from 'sweetalert';

function GlobalNav(): React.ReactElement {

    const history = useHistory();

    const logoutSubmit = (e: any) => {
        e.preventDefault();

        axios.post(`/api/logout`).then(res => {
            if (res.data.status === 200) {
                localStorage.removeItem('auth_token');
                localStorage.removeItem('auth_name');
                swal("ログアウトしました", res.data.message, "success");
                history.push('/');
                location.reload();
            } 
        });
    }

    var AuthButtons: any = null;

    if (!localStorage.getItem('auth_token')){
        AuthButtons = (
            // https://www.soudegesu.com/post/javascript/react-jsx-placement/
            <React.Fragment>
                <li>
                    <Link to="/register">
                        <span>Register</span>
                    </Link>
                </li>
                <li>
                    <Link to="/login">
                        <span>Login</span>
                    </Link>
                </li>
            </React.Fragment>
        );
    } else {
        AuthButtons = (
            <li>
                <div onClick={logoutSubmit}>
                    <span className="text-white">ログアウト</span>
                </div>
            </li>
        );
    }

    return(
        <ul>
            <li>
                <Link to="/">
                    <span>Top</span>
                </Link>
            </li>
            <li>
                <Link to="/about">
                    <span>About</span>
                </Link>
            </li>
            {AuthButtons}
        </ul>
    )
}

export default GlobalNav;