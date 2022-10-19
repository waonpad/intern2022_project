import React, { useEffect, useState } from 'react';
import ReactLoading from 'react-loading';
import ReactDOM from 'react-dom';
import { Button, Card } from '@material-ui/core';
import { Link, useParams } from "react-router-dom";
import axios from 'axios';

function User(): React.ReactElement {

    // 表示中のユーザーのid
    const {id} = useParams<{id: string}>();

    const [loading, setLoading] = useState(true);
    const [followStatus, setFollowStatus] = useState(false);
    const [myself, setMyself] = useState(false);

    const followToggle = () => {
        axios.post('/api/followtoggle', {screen_name: id}).then(res => {
            if(res.data.status === true) {
                console.log(res);
                setFollowStatus(res.data.follow_status);
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
        axios.get('/api/user/show', {params: data}).then(res => {
            if (res.status === 200) {
                setUserData(res.data);
                console.log(res);
            }
        });
        
        if (!localStorage.getItem('auth_token')){
            setFollowStatus(false);
            setLoading(false);
        }
        else {
            axios.get('/api/ffcheck', {params: {screen_name: id}}).then(res => {
                if(res.status === 200) {
                    console.log(res);
                    setMyself(res.data.myself);
                    setFollowStatus(res.data.follow);
                    setLoading(false);
                }
            })
        }
    }, [])

    return (
        <React.Fragment>
            <h1>User:{id}</h1>
            {   
                loading ? (
                    <ReactLoading type="spin" height="20px" width="20px" />
                ) :
                myself ? (
                    <Button>Edit Profile</Button>
                ) : (
                    <Button onClick={followToggle}>{followStatus ? 'unFollow' : 'Follow'}</Button>
                )
            }<br />
            {userData.screen_name ? <span>{userData.screen_name}</span> : <ReactLoading type="spin" height="20px" width="20px" />}<br />
            {userData.name ? <span>{userData.name}</span> : <ReactLoading type="spin" height="20px" width="20px" />}<br />
            {userData.email ? <span>{userData.email}</span> : <ReactLoading type="spin" height="20px" width="20px" />}<br />
            {userData.password ? <span>{userData.password}</span> : <ReactLoading type="spin" height="20px" width="20px" />}<br />
        </React.Fragment>
    );
}

export default User;