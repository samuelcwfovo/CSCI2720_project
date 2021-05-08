//---------------------------------------------------
// Cheng Yun Chueng 1155109570
// Wong Kong Wa 1155127049
// Chow Wang Faat 1155115793
// Lau Pak Hei Anson 1155158646
//---------------------------------------------------

import React, { useState, useContext, useEffect } from 'react';

import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, Redirect, useLocation } from 'react-router-dom';

import Loginboard from './components/login.jsx';
import Dashboard from './components/dashBoard.jsx';

import { AuthContext } from './context/ControlContext.jsx';


const App = () => {

    const [isAuth, setAuth] = useState(false);

    useEffect(() => {
    })



    return (
        <AuthContext.Provider value={{
            isAuth: isAuth,
            setAuth: setAuth
        }} >
            <BrowserRouter>
                <Switch>

                    <Route path="/login" component={Loginboard} />

                    <PrivateRoute path="/dashboard" component={Dashboard} />


                    <PrivateRoute path="/" >
                        <Redirect to='/dashboard' />
                    </PrivateRoute>



                </Switch>
            </BrowserRouter>
        </AuthContext.Provider>

    )
}

function PrivateRoute({ children, ...rest }) {
    const authUtil = useContext(AuthContext);

    let location = useLocation()
    console.log("location")
    console.log(location)

    console.log(authUtil)

    if (!authUtil.isAuth) {
        console.log("not auth to private route")
        console.log(rest)
        return (
            <Route {...rest}>
                {/* <Redirect to='/login' /> */}
                <Redirect
                    to={{
                        pathname: "/login",
                        state: { from: location.pathname }
                    }}
                />
            </Route>
        )
    }

    return (
        <Route {...rest} render={() => children} />
    );
}



ReactDOM.render(<App />, document.getElementById('app'));
