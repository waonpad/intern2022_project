import React, { useEffect, useState } from 'react';
import ReactLoading from 'react-loading';
import ReactDOM from 'react-dom';
import { Button, Card } from '@material-ui/core';
import { Link, useParams } from "react-router-dom";
import axios from 'axios';

// https://fullstacklife.net/programming/typescript/react-router-get-url-param-ts/

function User(): React.ReactElement {

    // 表示中のユーザーのid
    const {id} = useParams<{id: string}>();

    // 自分のid
    const [myid, setMyId] = useState('');

    const [FollowButton, setFollowButton] = useState(<ReactLoading type="spin" height="20px" width="20px" />);

    if (!localStorage.getItem('auth_token')){
        setMyId('');
    }
    else {
        useEffect(() => {
            axios.get(`/api/myself`).then(res => {
                if (res.status === 200) {
                    setMyId(res.data.screen_name);
                    console.log(res);

                    // 表示中のユーザーが自分であるか
                    if(id === res.data.screen_name) {
                        setFollowButton((
                            <React.Fragment>
                                <Button>Edit Profile</Button>
                            </React.Fragment>
                        ))
                    }
                    else {
                        setFollowButton((
                            <React.Fragment>
                                <Button>Follow</Button>
                            </React.Fragment>
                        ))
                    }
                }
            });
        }, [])
    }

    const [userData, setUserData] = useState({
        screen_name: '',
        name: '',
        email: '',
        password: '',
    });

    const data = {
        screen_name: id,
    };

    useEffect(() => {
        axios.get('/api/getuser', {params: data}).then(res => {
            if (res.status === 200) {
                setUserData(res.data);
                console.log(res);
            }
        });
    }, [])

    return (
        <React.Fragment>
            <h1>User:{id}</h1>
            {/* タスク：フォロー機能を作る */}
            {FollowButton}<br />
            {userData.screen_name ? <span>{userData.screen_name}</span> : <ReactLoading type="spin" height="20px" width="20px" />}<br />
            {userData.name ? <span>{userData.name}</span> : <ReactLoading type="spin" height="20px" width="20px" />}<br />
            {userData.email ? <span>{userData.email}</span> : <ReactLoading type="spin" height="20px" width="20px" />}<br />
            {userData.password ? <span>{userData.password}</span> : <ReactLoading type="spin" height="20px" width="20px" />}<br />
        </React.Fragment>
    );
}

export default User;