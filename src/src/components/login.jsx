//---------------------------------------------------
// Cheng Yun Chueng 1155109570
// Wong Kong Wa 1155127049
// Chow Wang Faat 1155115793
// Lau Pak Hei Anson 1155158646
//---------------------------------------------------

import React, { useState, useEffect, useContext, useLayoutEffect } from 'react';
import { useHistory, useLocation, useParams } from "react-router-dom";

import '.././assets/css/login.css';
import { AuthContext } from '../context/ControlContext.jsx';

import { PermIdentity, ArrowBack, Person, Lock } from '@material-ui/icons';


const LoginForm = () => {
    const [login, setLogin] = useState(true);
    const authUtil = useContext(AuthContext);
    let history = useHistory();
    let location = useLocation();

    let toPath = location.state ? location.state.from : '/';

    const onArrowClick = () => {
        setLogin(!login)
    }

    const Login = () => {
        let userName = document.querySelector("#login-username")
        let password = document.querySelector("#login-password")

        //reset custom valid
        userName.setCustomValidity("")

        if (document.querySelector('#login-form').reportValidity()) {
            fetch('api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userName: userName.value,
                    password: password.value
                })
            })
                .then(data => data.json())
                .then(res => {
                    if (res.code === 0) {
                        console.log("server error")
                        console.log(res)
                    }
                    if (res.code === 1) {
                        userName.setCustomValidity("username / password incorrect")
                        userName.reportValidity()
                    }

                    if (res.code === 2) {
                        console.log(res)
                        sessionStorage.setItem('userId', res.userInfo.userId);
                        sessionStorage.setItem('userName', res.userInfo.userName);
                        sessionStorage.setItem('admin', res.userInfo.admin);
                        authUtil.setAuth(true)
                        history.push(toPath);
                    }

                })
        }
    }

    const Signup = () => {
        let userName = document.querySelector("#signup-username")
        let password = document.querySelector("#signup-password")
        let password2 = document.querySelector("#signup-second-password")

        //reset if it seted before
        password.setCustomValidity("")
        userName.setCustomValidity("")

        if (document.querySelector('#signup-form').reportValidity()) {
            if (password.value !== password2.value) {
                password.setCustomValidity("password not match with comfirm password")
                password.reportValidity()
                return
            }

            fetch('api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userName: userName.value,
                    password: password.value
                })
            })
                .then(data => data.json())
                .then(res => {
                    if (res.code === 0) {
                        console.log("server error")
                        console.log(res)
                    }
                    if (res.code === 1) {
                        userName.setCustomValidity("username already in use.")
                        userName.reportValidity()
                    }

                    if (res.code === 2) {
                        sessionStorage.setItem('userId', res.userInfo.userId);
                        sessionStorage.setItem('userName', res.userInfo.userName);
                        sessionStorage.setItem('admin', res.userInfo.admin);
                        authUtil.setAuth(true)
                        history.push(toPath);
                    }
                })


        }

    }

    return (
        <div id="container" className="p-4 text-center">
            <h6 className="mb-0 py-3 user-select-none">
                <span>Log In</span>
                <span>Sign Up</span>
            </h6>

            <div className="d-flex justify-content-center mb-4">
                <div id="roll-arrow" onClick={onArrowClick}>
                    <div id="arrow-wrapper"
                        className={login ? "original-arrow-wrapper" : "rotated-arrow-wrapper"} >
                        <ArrowBack id="arrow"
                            className={login ? "" : "rotated-arrow"} />
                    </div>
                </div>
            </div>

            <div className="card-3d-wrap mx-auto">
                <div className="card-3d-wrapper">
                    <div className={
                        login ? "front" : "front front-rotate"
                    }>
                        <div className="section text-center mt-5 effect-3d">
                            <h4 className="mb-4">LOG IN</h4>
                        </div>
                        <form id="login-form">
                            <div className="input-group py-3 mx-3 width-auto effect-3d">
                                <span className="input-group-text"><Person /></span>
                                <input type="text" className="form-control" id="login-username" placeholder="Username" required onInput={(e) => e.target.setCustomValidity('')} />
                            </div>
                            <div className="input-group py-3 mx-3 width-auto effect-3d">
                                <span className="input-group-text"><Lock /></span>
                                <input type="password" className="form-control" id="login-password" placeholder="Password" required />
                            </div>
                            <div className="py-5 mx-3 effect-3d">
                                <button type="button" className="btn btn-outline-light" onClick={Login}>LOG IN</button>
                            </div>
                        </form>
                    </div>

                    <div className={
                        login ? "back" : "back back-rotate"
                    }>
                        <div className="section text-center mt-5 effect-3d">
                            <h4 className="mb-1">SIGN UP</h4>
                        </div>

                        <form id="signup-form">
                            <div className="input-group py-3 mx-3 width-auto effect-3d">
                                <span className="input-group-text" ><Person /></span>
                                <input type="text" className="form-control" id="signup-username" placeholder="Username" required onInput={(e) => e.target.setCustomValidity('')} />
                            </div>
                            <div className="input-group py-3 mx-3 width-auto effect-3d">
                                <span className="input-group-text"><Lock /></span>
                                <input type="password" className="form-control" id="signup-password" placeholder="Password" required onInput={(e) => e.target.setCustomValidity('')} />
                            </div>
                            <div className="input-group py-3 pb-4 mx-3 width-auto effect-3d">
                                <span className="input-group-text"><Lock /></span>
                                <input type="password" className="form-control" id="signup-second-password" placeholder="Comfirm Password" required />
                            </div>

                            <div className="py-3 mx-3">
                                <button type="button" className="btn btn-outline-light" onClick={Signup}>SIGN UP</button>

                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    )
}


const Login = () => {



    const [hovered, setHovered] = useState(false);
    const [clicked, setClicked] = useState(false);

    const authUtil = useContext(AuthContext);
    let history = useHistory();
    let location = useLocation();

    let toPath = location.state ? location.state.from : '/';

    useLayoutEffect(() => {
        document.body.classList.add('bg-login');
        backgroundLogin();
        console.log("background login");
        return () => {
            document.body.classList.remove('bg-login');
        };
    }, []);

    const backgroundLogin = () => {
        fetch('api/auth/token', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(data => data.json())
            .then(res => {
                console.log(res)
                if (res.code === 1) {
                    console.log("token login fail", res)
                }
                if (res.code === 2) {
                    sessionStorage.setItem('userId', res.userInfo.userId);
                    sessionStorage.setItem('userName', res.userInfo.userName);
                    sessionStorage.setItem('admin', res.userInfo.admin);

                    authUtil.setAuth(true)
                    history.push(toPath);
                    console.log('backgorund login ' + res.userInfo.admin)
                }
            })
    }

    const onHover = () => {
        setHovered(true)
    }

    const onUnHover = () => {
        setHovered(false)
    }

    const onIdClick = () => {
        setClicked(true)
    }


    return (
        <div id="filter"
            className={
                hovered && (clicked && "semi-blur" || "blur") || ""
            }
        >
            <div className="container">
                <div className="row justify-content-center align-self-center">
                    {clicked ?
                        <LoginForm /> :
                        <PermIdentity
                            id="permId"
                            onMouseOver={onHover}
                            onMouseOut={onUnHover}
                            onClick={onIdClick}
                            className={
                                hovered ? "hoveredId" : ""
                            }
                        />
                    }
                </div>
            </div>
        </div>
    )
}


export default Login;

// ReactDOM.render(<App />, document.getElementById('app'));
