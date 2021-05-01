import React, { useState, useLayoutEffect, useContext } from 'react';
import '../assets/css/dashboard.css';

import { LocalHospitalOutlined, FavoriteTwoTone, DescriptionOutlined, ScheduleOutlined, PeopleAltOutlined, Menu, AccountCircle } from '@material-ui/icons';

import { Link, Route, Switch, Redirect, useRouteMatch, useHistory } from 'react-router-dom';

import { AuthContext } from '../context/ControlContext.jsx';


import HospitalsMap from './subpage/hospitalsMap.jsx';
import FavouritePlace from './subpage/favouritePlace.jsx';
import HospitalsManage from './subpage/hospitalsManage.jsx';
import UserManage from './subpage/userManage.jsx';




const Dashboard = () => {

    const [selected, setSelect] = useState(0);

    const authUtil = useContext(AuthContext);

    let userName = sessionStorage.getItem('userName');
    let isAdmin = sessionStorage.getItem('admin');

    let history = useHistory();

    useLayoutEffect(() => {
        document.body.classList.add('dashboard-body');
        return () => {
            document.body.classList.remove('dashboard-body');
        };
    }, []);

    const Logout = () => {
        authUtil.setAuth(false);
        document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';

        console.log(document.cookie);

        history.push("/");
    }

    const navItem = [
        {
            name: "Hospitals",
            adminOnly: false,
            link: "hospitals",
            icon: LocalHospitalOutlined

        },
        {
            name: "Favourite places",
            adminOnly: false,
            link: 'favourite',
            icon: FavoriteTwoTone
        },
        {
            name: "Hospitals management",
            adminOnly: false,
            link: "hospitals-manage",
            icon: DescriptionOutlined
        },
        {
            name: "Users management",
            adminOnly: false,
            link: "users-manage",
            icon: PeopleAltOutlined
        },


    ];


    const navMouseClick = (index) => {
        if (selected != index) {
            setSelect(index)
        }
        console.log(index)

    }

    const navListClick = () => {
        document.querySelector("#sidenav-close").click();
    }


    return (
        <div className="dashboard-wrapper">
            <div id="dashboard-filter" />
            <aside id="sidenav-open">
                <div className="nav-wrapper">
                    <div className="app-logo">
                        <ScheduleOutlined />
                        <span>AE WAITING TIME</span>

                    </div>
                    <div className="nav-list">
                        {
                            navItem.map((item, index) => {
                                if (!item.adminOnly) {
                                    return (
                                        <div key={index} onClick={() => navMouseClick(index)}
                                            className={selected == index ? "nav-list-item active" : "nav-list-item"}>
                                            <Link to={"/dashboard/"+item.link} className="nav-list-link" onClick={() => navListClick()}>
                                                {<item.icon className="123" />}
                                                {item.name}
                                            </Link>
                                        </div>
                                    )
                                }
                            })
                        }
                    </div>
                </div>
                <a href="#" id="sidenav-close" title="Close Menu" aria-label="Close Menu"></a>
            </aside>
            <main className="dashboard-main">
                <header className="d-flex align-items-center justify-content-between sticky-top p-3 header">
                    <div className="d-flex align-items-center justify-content-between">
                        <a href="#sidenav-open" id="open-menu" className="d-none mx-3" title="Open Menu" aria-label="Open Menu">
                            <Menu />
                        </a>
                        <div className="fw-bold mx-2 fs-3">Dashboard</div>
                    </div>

                    <div className="user-info d-flex flex-row align-items-center fs-5">
                        <span >{userName}</span>
                        <AccountCircle className="mx-3 fs-3" />
                        <button type="button" className="btn btn-outline-info" onClick={()=> Logout()}>LOGOUT</button>
                    </div>
                </header>

                <Switch>
                    <Route path={"/dashboard/hospitals"} component={HospitalsMap} />
                    <Route path={"/dashboard/favourite"} component={FavouritePlace} />
                    <Route path={"/dashboard/hospitals-manage"} component={HospitalsManage} />
                    <Route path={"/dashboard/users-manage"} component={UserManage} />
                    <Route exact path="/dashboard">
                        <Redirect to='/dashboard/hospitals'/>
                    </Route>

                </Switch>

            </main>


        </div>
    )
}



export default Dashboard;