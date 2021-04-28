import React, { useState, useLayoutEffect } from 'react';
import '../assets/css/dashboard.css';

import { LocalHospitalOutlined, FavoriteTwoTone, DescriptionOutlined, ScheduleOutlined, PeopleAltOutlined, Menu, AccountCircle } from '@material-ui/icons';


const Dashboard = () => {

    const [selected, setSelect] = useState(0);


    useLayoutEffect(() => {
        document.body.classList.add('dashboard-body');

        return () => {
            document.body.classList.remove('dashboard-body');
        };
    }, []);

    const navItem = [
        {
            name: "Hospitals",
            adminOnly: false,
            icon: LocalHospitalOutlined

        },
        {
            name: "Favourite places",
            adminOnly: false,
            icon: FavoriteTwoTone
        },
        {
            name: "Hospitals management",
            adminOnly: false,
            icon: DescriptionOutlined
        },
        {
            name: "Users management",
            adminOnly: false,
            icon: PeopleAltOutlined
        },


    ];


    const navMouseClick = (index) => {
        if (selected != index) {
            setSelect(index)
            console.log(index)
        }
    }


    return (
        <div className="dashboard-wrapper">
            <div id="filter" />
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
                                            <a className="nav-list-link">
                                                {<item.icon className="123" />}
                                                {item.name}
                                            </a>
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
                        <spam >admin</spam>
                        <AccountCircle className="mx-3 fs-3" />
                        <button type="button" class="btn btn-outline-info">LOGOUT</button>

                    </div>
                </header>
            </main>
        </div>
    )
}

export default Dashboard;