import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Card } from '@material-ui/core';
import { Link } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";


function About(): React.ReactElement {
    
    const auth = useAuth();
    console.log(auth);

    return (
        <h1>About</h1>
    );
}

export default About;