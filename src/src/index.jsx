import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './assets/css/main.css';

import { PermIdentity } from '@material-ui/icons';


const App = () => {
    const [blur, setBlur] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const blueEnable = () => {
        setBlur(true)
    }

    const blueDisable = () => {
        setBlur(false)
    }

    const formEnable = () => {
        setShowForm(true)
    }


    return (
        <div id="bg">
            <div id="filter"
                className={
                    blur ? "blur" : "a"
                }
            >
                {showForm ?
                    null :
                    <PermIdentity
                        id="permId"
                        onMouseOver={blueEnable}
                        onMouseOut={blueDisable}
                        onClick={formEnable}
                    />
                }
            </div>
        </div>
    )
}

ReactDOM.render(<App />, document.getElementById('app'));
