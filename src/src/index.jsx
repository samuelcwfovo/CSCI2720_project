import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './assets/css/main.css';

// import PermIdentityIcon from '@material-ui/icons/PermIdentity';

import { PermIdentity } from '@material-ui/icons';


const App = () => {
    const [blur, setBlur] = useState(false);

    const blueEnable = () => {
        setBlur(true)
    }

    const blueDisable = () => {
        setBlur(false)
    }


    return (
        <div id="bg">
            <div id="filter"
                className={
                    blur ? "blur" : ""
                }
            >
                <PermIdentity
                    id="permId"
                    onMouseOver = {blueEnable}
                    onMouseOut = {blueDisable}
                />
            </div>
        </div>
    )
}

ReactDOM.render(<App />, document.getElementById('app'));
