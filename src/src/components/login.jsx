import React, { useState, useEffect } from 'react';
import '.././assets/css/main.css';

import { PermIdentity, ArrowBack, Person, Lock } from '@material-ui/icons';


const LoginForm = () => {
    const [login, setLogin] = useState(true);

    const onArrowClick = () => {
        setLogin(!login)
    }

    return (
        <div id="container" className="p-4 text-center">
            <h6 className="mb-0 py-3">
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
                            <h4 className="mb-4 ">LOG IN</h4>
                        </div>
                        <div className="input-group py-3 mx-3 width-auto effect-3d">
                            <span className="input-group-text" id="inputGroupPrepend2"><Person /></span>
                            <input type="text" className="form-control " id="validationDefaultUsername"
                                placeholder="Username" aria-describedby="inputGroupPrepend2" required />
                        </div>
                        <div className="input-group py-3 mx-3 width-auto effect-3d">
                            <span className="input-group-text" id="inputGroupPrepend2"><Lock /></span>
                            <input type="password" className="form-control  " id="validationDefaultUsername"
                                placeholder="Password" aria-describedby="inputGroupPrepend2" required />
                        </div>

                        <div className="py-5 mx-3 effect-3d">
                            <button type="button" className="btn btn-outline-light">LOG IN</button>

                        </div>
                    </div>

                    <div className={
                        login ? "back" : "back back-rotate"
                    }>
                        <div className="section text-center mt-5 effect-3d">
                            <h4 className="mb-1 ">SIGN UP</h4>
                        </div>
                        <div className="input-group py-3 mx-3 width-auto effect-3d">
                            <span className="input-group-text" id="inputGroupPrepend2"><Person /></span>
                            <input type="text" className="form-control " id="validationDefaultUsername"
                                placeholder="Username" aria-describedby="inputGroupPrepend2" required />
                        </div>
                        <div className="input-group py-3 mx-3 width-auto effect-3d">
                            <span className="input-group-text" id="inputGroupPrepend2"><Lock /></span>
                            <input type="password" className="form-control  " id="validationDefaultUsername"
                                placeholder="Password" aria-describedby="inputGroupPrepend2" required />
                        </div>
                        <div className="input-group py-3 pb-4 mx-3 width-auto effect-3d">
                            <span className="input-group-text" id="inputGroupPrepend2"><Lock /></span>
                            <input type="password" className="form-control  " id="validationDefaultUsername"
                                placeholder="Comfirm Password" aria-describedby="inputGroupPrepend2" required />
                        </div>

                        <div className="py-3 mx-3">
                            <button type="button" className="btn btn-outline-light">SIGN UP</button>

                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}


const Login = () => {
    const [hovered, setHovered] = useState(false);
    const [clicked, setClicked] = useState(false);

    useEffect(() => {
        document.body.classList.add('bg-login');
        return () => {
            document.body.classList.remove('bg-login');
        };
    });


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
