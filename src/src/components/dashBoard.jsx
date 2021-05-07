import React, { useState, useLayoutEffect, useContext, useEffect } from 'react';
import '../assets/css/dashboard.css';

import {
    LocalHospitalOutlined, FavoriteTwoTone, DescriptionOutlined, ScheduleOutlined,
    PeopleAltOutlined, Menu, AccountCircle, Fullscreen, FullscreenExit
} from '@material-ui/icons';

import { Link, Route, Switch, Redirect, useHistory } from 'react-router-dom';

import { AuthContext } from '../context/ControlContext.jsx';


import HospitalsMap from './subpage/hospitalsMap.jsx';
import HospitalDetail from './subpage/hospitalDetail.jsx';
import FavouritePlace from './subpage/favouritePlace.jsx';
import HistoricalData from './subpage/historicalData.jsx';
import HospitalsManage from './subpage/hospitalsManage.jsx';
import UserManage from './subpage/userManage.jsx';




const Dashboard = () => {

    const [selected, setSelect] = useState(0);
    const [fullScreen, setFullScreen] = useState(false);

    const authUtil = useContext(AuthContext);

    let userName = sessionStorage.getItem('userName');
    let isAdmin = sessionStorage.getItem('admin') == 'true' ? true : false;

    let history = useHistory();

    useLayoutEffect(() => {
        document.body.classList.add('dashboard-body');
        return () => {
            document.body.classList.remove('dashboard-body');
        };
    }, []);

    useEffect(() => {
        setCurrentNav();
    });

    const setCurrentNav = () => {
        let path = history.location.pathname;

        let data = [
            {
                name: 'hospitals',
                id: 0,
            },
            {
                name: 'favourite',
                id: 1,
            },
            {
                name: 'historical-data',
                id: 2,
            },
            {
                name: 'places-manage',
                id: 3,
            },
            {
                name: 'users-manage',
                id: 4,
            },
        ]

        data.forEach(element => {
            if (path.includes(element.name)) {
                setSelect(element.id)
            }
        })

    }

    //delete cookie + set global auth false
    const Logout = () => {
        authUtil.setAuth(false);
        document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        sessionStorage.clear();

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
            name: "Favourite",
            adminOnly: false,
            link: 'favourite',
            icon: FavoriteTwoTone
        },
        {
            name: "Historical",
            adminOnly: false,
            link: 'historical-data',
            icon: DescriptionOutlined

        },
        {
            name: "Place Data",
            adminOnly: true,
            link: "places-manage",
            icon: DescriptionOutlined
        },
        {
            name: "User Data",
            adminOnly: true,
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

    const fullScreenClick = () => {
        if (!fullScreen) {
            setFullScreen(true);
            document.documentElement.requestFullscreen();
        } else {
            setFullScreen(false);
            document.exitFullscreen();
        }
    }

    return (
        <div className="dashboard-wrapper">
            <div id="dashboard-filter" />
            <aside id="sidenav-open">
                <div className="nav-wrapper">
                    <div className="app-logo">
                        {/* <ScheduleOutlined /> */}
                        <span className="fw-bold fs-4">AE TIME</span>

                    </div>
                    <div className="nav-list">
                        {
                            navItem.map((item, index) => {
                                if (!item.adminOnly || isAdmin) {
                                    return (
                                        <div key={index} onClick={() => navMouseClick(index)}
                                            className={selected == index ? "nav-list-item active" : "nav-list-item"}>
                                            <Link to={"/dashboard/" + item.link} className="nav-list-link" onClick={() => navListClick()}>
                                                {<item.icon />}
                                                {item.name}
                                            </Link>
                                        </div>
                                    )
                                }
                            })
                        }
                    </div>

                    <div className="d-flex align-items-center flex-row justify-content-around p-4" style={{ borderTop: "2px solid rgba(133, 133, 133, 0.1)" }}>
                        <button type="button" className="btn btn-outline-light" onClick={() => Logout()}>LOGOUT</button>
                        <div id="full-screen" className="d-none" onClick={() => fullScreenClick()}>
                            {fullScreen ? <FullscreenExit /> : <Fullscreen />}
                        </div>

                    </div>
                </div>
                <a href="#" id="sidenav-close" title="Close Menu" aria-label="Close Menu"></a>
            </aside>
            <main className="dashboard-main">
                <header className="sticky-top p-3 header">
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                            <a href="#sidenav-open" id="open-menu" className="d-none mr-2" title="Open Menu" aria-label="Open Menu">
                                <Menu />
                            </a>
                            <div className="fw-bold mx-2 fs-3 theme-text-color">{navItem[selected].name}</div>
                        </div>
                        <div className="d-flex align-items-center">
                            <span className="fs-5 theme-text-color" style={{ fontWeight: 900 }}>{userName}</span>
                            <AccountCircle className="mx-2 fs-2" style={{ color: 'black' }} />
                        </div>
                    </div>

                    {/* <div className="user-info d-flex flex-row align-items-center fs-5">
                        <span >{userName}</span>
                        <AccountCircle className="mx-3 fs-3" />
                        <button type="button" className="btn btn-outline-info" onClick={() => Logout()}>LOGOUT</button>
                    </div> */}
                    {/* <div id="full-screen" className="d-none" onClick={() => fullScreenClick()}>
                            {fullScreen ? <FullscreenExit /> : <Fullscreen />}
                        </div> */}

                </header>

                <div className="container-fluid dashboard-contaioner">
                    <Switch>
                        <Route path="/dashboard/hospitals/:locId" component={HospitalDetail} />
                        <Route path={"/dashboard/hospitals"} component={HospitalsMap} />
                        <Route path={"/dashboard/favourite"} component={FavouritePlace} />
                        <Route path={"/dashboard/historical-data"} component={HistoricalData} />
                        <Route path={"/dashboard/places-manage"} component={HospitalsManage} />
                        <Route path={"/dashboard/users-manage"} component={UserManage} />
                        <Route exact path="/dashboard">
                            <Redirect to='/dashboard/hospitals' />
                        </Route>
                    </Switch>
                </div>
            </main>


        </div>
    )
}

const {isEmpty, retrieveQuery} = require('./modules/json-util')
const validCol = ['locId', 'name', 'latitude', 'longitude'];

// Return all documents satisfying request conditions
router.get('/api/admin/hospital', authenticateJWT, async function (req, res) {
	let locations = await LocationModel.find().lean();

		locations = await Promise.all(
			locations.map(async (location) => {
				try {
					const waitTime = await WaitingTimeModel.findOne({ 'locationId': location.locId })
						.sort({ 'date': -1 }).lean();
					return { ...location, waitTime };
				} catch (err) {
					return res.status(500).json({ code: 0, error: err, description: "find waitTime error" });
				}
			})
		);
		
		return res.status(200).json({ code : 2, description : "Success", hospitals: locations });
});

// Create ONE document with request body
router.post('/api/admin/hospital', authenticateJWT, function (req, res) {
    const decoded = req.decoded;
    if (!decoded.admin) return res.status(400).json({ code: 1, description: "create hospital permission denied." });
	
	let newLocation = new LocationModel({
				locId: req.body.locId,
                name: req.body.name,
                latitude: req.body.latitude,
                longitude: req.body.longitude
            })

    newLocation.save(function (err, savedloc) {
        if (err) return res.status(500).json({ code: 0, error: err, description: "save location error" });
		let newWaitingTime = new WaitingTimeModel({
				date: req.body.locId,
                locationId: req.body.locId,
                waitingTime: req.body.wt,
            })
		newWaitingTime.save(function (err, savedwt) {
			if (err) return res.status(500).json({ code: 0, error: err, description: "save waiting time error" });
			return res.status(201).json({ code: 2, description: "created." })
		})
    })
});

// Remove first record satisfing conditions in req.body
// Add {removeAll: true} in req.body for removing all records satisfing conditions
router.delete('/api/admin/hospital', authenticateJWT, function (req, res) {
    const decoded = req.decoded;
    if (!decoded.admin) return res.status(400).json({ code: 1, description: "delete hospital permission denied." });
	
	console.log(req.body.locId);
	
    LocationModel.deleteOne({ 'locId': req.body.locId }, function (err, deleted) {
            if (err) return res.status(500).json({ code: 0, error: err, description: "DB remove error" });
            else return res.status(200).json({ code : 2, description : "Success", removedCount: deleted.deletedCount });
        })
})

// Update the first document satisfing condition in req.body
/* Request body schema:
    {
        condition: {
            locId: Number,
            name: String,
            latitude: Number,
            longitude: Number,
        }
        new: {
            locId: { value: Number, update: Boolean },
            name: { value: String, update: Boolean },
            latitude: { value: Number, update: Boolean },
            longitude: { value: Number, update: Boolean },
        }
    }
*/
// At least one attribute in condition is required
// Column with attribute 'update' == true will be updated
router.put('/api/admin/hospital', authenticateJWT, function (req, res) {
    const decoded = req.decoded;
    if (!decoded.admin) return res.status(400).json({ code: 1, description: "update hospital permission denied." });

    let updateQuery = {}
    for (col in req.body.new) {
        if (validCol.includes(col) && req.body.new[col].update) {
            updateQuery[col] = req.body.new[col].value;
        }
    }

    let condition = retrieveQuery(req.body.condition, validCol);
    if (isEmpty(condition)) return res.status(400).json({ code: 1, description: "No valid condition is given." });

    LocationModel.findOneAndUpdate( retrieveQuery(req.body.condition, validCol), updateQuery, function (err, doc) {
        if (err) return res.status(500).json({ code: 0, error: err, description: "DB update error" });
        else return res.status(200).json({ code : 2, description : "Success", origDoc: doc });
    })
})

export default Dashboard;
