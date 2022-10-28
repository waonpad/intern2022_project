import React, { useState, useEffect, useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';
import { Button, Card } from '@material-ui/core';
import { Link } from "react-router-dom";
import axios from 'axios';

function Top(): React.ReactElement {

    // useEffect(() => {
    //     const data = {query: `query { 
    //         viewer { 
    //           login,
    //           createdAt,
    //         },
    //       }`};

    //     console.log(process.env.MIX_APP_GITHUB_TOKEN);

    //     axios.post(
    //         'https://api.github.com/graphql',
    //         data,
    //         {headers: {
    //             Authorization: `Bearer ${process.env.MIX_APP_GITHUB_TOKEN}`,
    //             'Access-Control-Allow-Origin' : 'https://api.github.com/',
    //             // 'Access-Control-Allow-Origin' : '*',
    //             // 'Access-Control-Allow-Credentials': true,
    //             "Access-Control-Allow-Headers": "*",
    //             'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    //             // 'content-type': 'application/json',
    //         }}
    //     ).then(res => {
    //         console.log(res);
    //     })
    // }, []);

    return (
        <div className="container">
            <Card>
                <Link to="/example">
                    <Button color="primary" variant="contained">Exampleに遷移する</Button>
                </Link>
            </Card>
        </div>
    );
}

export default Top;