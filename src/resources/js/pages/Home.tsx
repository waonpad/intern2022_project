import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Card } from '@material-ui/core'; //Buttonをインポート
import { Link } from "react-router-dom";

function Home(): React.ReactElement {
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

export default Home;