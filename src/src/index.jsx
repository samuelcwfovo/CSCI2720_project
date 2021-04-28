import React, { useState, useContext, useEffect } from 'react';

import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import Loginboard from './components/login.jsx';
import Dashboard from './components/dashBoard.jsx';
import { AuthContext } from './context/ControlContext.jsx';


const App = () => {

    const [isAuth, setAuth] = useState(false);

    useEffect(()=>{
        console.log(isAuth)
    })
    return (
        <AuthContext.Provider value={{
            isAuth: isAuth,
            setAuth: setAuth
        }} >
            <BrowserRouter>
                <Switch>

                    <Route path="/login">
                        <Loginboard />
                    </Route>

                    <Route exact path="/">
                        <Dashboard />
                    </Route>

                    <PrivateRoute exact path="/dashboard">
                        <Dashboard />
                    </PrivateRoute>


                </Switch>
            </BrowserRouter>
        </AuthContext.Provider>

    )
}

function PrivateRoute({ children, ...rest }) {
    const authUtil = useContext(AuthContext);

    return (
        <Route
            {...rest}
            render={({ location }) =>
            authUtil.isAuth ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: { from: location }
                        }}
                    />
                )
            }
        />
    );
}


ReactDOM.render(<App />, document.getElementById('app'));
