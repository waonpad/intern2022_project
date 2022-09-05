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

    const [FollowButton, setFollowButton] = useState(<ReactLoading type="spin" height="20px" width="20px" />);

    const follow = () => {
        axios.post('/api/follow', {screen_name: id}).then(res => {
            if(res.data.status === true) {
                console.log(res);
                
                setFollowButton((
                    <React.Fragment>
                        <Button onClick={unfollow}>UnFollow</Button>
                    </React.Fragment>
                ))
            }
        })
    }

    const unfollow = () => {
        axios.post('/api/unfollow', {screen_name: id}).then(res => {
            if(res.data.status === true) {
                console.log(res);
                
                setFollowButton((
                    <React.Fragment>
                        <Button onClick={follow}>Follow</Button>
                    </React.Fragment>
                ))
            }
        })
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
        
        if (!localStorage.getItem('auth_token')){
            setFollowButton((
                <React.Fragment>
                    <Button onClick={follow}>Follow</Button>
                </React.Fragment>
            ))
        }
        else {
            axios.get('/api/ffcheck', {params: {screen_name: id}}).then(res => {
                if(res.status === 200) {
                    console.log(res);
                    
                    // 表示中のユーザーが自分であるか フォローしているかしていないか
                    if(res.data.myself === true) {
                        setFollowButton((
                            <React.Fragment>
                                <Button>Edit Profile</Button>
                            </React.Fragment>
                        ))
                    }
                    else if(res.data.follow === true) {
                        setFollowButton((
                            <React.Fragment>
                                <Button onClick={unfollow}>UnFollow</Button>
                            </React.Fragment>
                        ))
                    }
                    else if(res.data.follow === false) {
                        setFollowButton((
                            <React.Fragment>
                                <Button onClick={follow}>Follow</Button>
                            </React.Fragment>
                        ))
                    }
                }
            })
        }
    }, [])

    return (
        <React.Fragment>
            <h1>User:{id}</h1>
            {FollowButton}<br />
            {userData.screen_name ? <span>{userData.screen_name}</span> : <ReactLoading type="spin" height="20px" width="20px" />}<br />
            {userData.name ? <span>{userData.name}</span> : <ReactLoading type="spin" height="20px" width="20px" />}<br />
            {userData.email ? <span>{userData.email}</span> : <ReactLoading type="spin" height="20px" width="20px" />}<br />
            {userData.password ? <span>{userData.password}</span> : <ReactLoading type="spin" height="20px" width="20px" />}<br />
        </React.Fragment>
    );
}

export default User;