import React, { useEffect, useState } from 'react';
import ReactLoading from 'react-loading';
import ReactDOM from 'react-dom';
import { Button, Card } from '@material-ui/core';
import { Link, useHistory } from "react-router-dom";
import axios from 'axios';
import swal from 'sweetalert';

import { useAuth } from "../AuthContext";

function GlobalNav(): React.ReactElement {

    const history = useHistory();
    const auth = useAuth();

    console.log(auth);

	useEffect(() => {
        if(auth!.user !== null) {
            axios.get('/api/notifications').then(res => {
                if (res.status === 200) {
                    // setDispUserId(res.data.id);
                    console.log(res);

                    // setInitialLoad(false);
                }
            }).catch((error) => {
                // console.log(error);
                // setInitialLoad(false);
            });

            window.Echo.private('App.Models.User.' + auth!.user!.id)
            .notification((notification: any) => {
                console.log(notification);
            })
        }

        // readNotification("37d6b77b-ec53-4858-b0e4-ab9eaa5d4e07");

        // readAllNotifications();
    }, [auth!.user])

    const readNotification = (notification_id: any) => {
        axios.post('/api/readnotification', {notification_id: notification_id}).then(res => {
            if (res.status === 200) {
                console.log(res);
            }
        }).catch((error) => {
            console.log(error);
        })
    }

    const readAllNotifications = () => {
        axios.post('/api/readallnotifications').then(res => {
            if (res.status === 200) {
                console.log(res);
            }
        }).catch((error) => {
            console.log(error);
        })
    }

    const logout = () => {
        axios.get('/sanctum/csrf-cookie').then(() => {
        auth?.signout().then(() => {
            swal("ログアウトしました", "ログアウト成功", "success");
            history.push('/');
            location.reload();
        })
        })
    }

    var AuthButtons: any = null;
    // var myid: any = auth!.user!.screen_name! ? auth!.user!.screen_name! : "test";

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
            <React.Fragment>
                <div>
                    {/* {myid ? <Link to={"/user/" + myid}><span>{myid}</span></Link> : <ReactLoading type="spin" height="20px" width="20px" />} */}
                    {/* <div>{auth!.user!.screen_name! ? auth!.user!.screen_name! : "test"}</div> */}
                </div>
                <Link to="/chat">
                    <span>Chat</span>
                </Link>
                <br/>
                <Link to="/privatechat">
                    <span>PrivateChat</span>
                </Link>
                <br/>
                <Button variant="contained" onClick={logout}>ログアウト</Button>
            </React.Fragment>
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