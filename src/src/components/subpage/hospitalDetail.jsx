//---------------------------------------------------
// Cheng Yun Chueng 1155109570
// Wong Kong Wa 1155127049
// Chow Wang Faat 1155115793
// Lau Pak Hei Anson 1155158646
//---------------------------------------------------

import React, { useState, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';
import { useParams } from "react-router-dom";

import { GoogleMapKey } from '../../assets/key.jsx';
import '../../assets/css/hospitalDetail.css';
import { Favorite, FavoriteBorder, EmojiEmotions } from '@material-ui/icons';
import { Bar } from 'react-chartjs-2';


const HistoricalDataHour = () => {
    let { locId } = useParams();

    const [tenHour, setTenHour] = useState([]);


    useEffect(() => {
        FetchTenHour();
    }, []);

    const FetchTenHour = () => {
        fetch('/api/historical/past-10-hour/' + locId, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(data => data.json())
            .then(res => {
                if (res.code === 2) {
                    setTenHour(res.finalData)

                } else {
                    console.log("fetch comment fail", res)
                }
            })
    }

    let datalabel = []
    let dataSet = tenHour;

    dataSet.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());


    dataSet.forEach(data => {
        let d = new Date(data.date);
        datalabel.push(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    })


    let displayDate = []

    dataSet.forEach(data => {
        let d = Number(data.waitingTime.match(/\d+/));
        displayDate.push(d)
    })




    const data = {
        labels: datalabel,
        datasets: [
            {
                label: 'waiting hour',
                data: displayDate,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 99, 132, 0.2)',

                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 99, 132, 1)',

                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        scales: {
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true,
                    },
                },
            ],
        },
        maintainAspectRatio: true,
    };

    const VerticalBar = () => (
        <div className="hospital-detail-info-chart">
            <div className='hospital-detail-info-chart-titleWrapper'>
                <h6 className='hospital-detail-info-chart-title'>Waiting Time (past 10 hours)</h6>
            </div>
            <Bar
                data={data}
                options={options}
            />
        </div>
    );

    return tenHour.length > 0 ? VerticalBar() : null;

}

const HistoricalDataDay = (props) => {

    let dataSet = props.dataSets;

    let datalabel = []

    dataSet.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());


    dataSet.forEach(data => {
        let d = new Date(data.date);
        datalabel.push(d.toLocaleString([], { month: '2-digit', day: '2-digit' }));
    })


    let displayDate = []

    dataSet.forEach(data => {
        let d = Number(data.waitingTime.match(/\d+/));
        displayDate.push(d)
    })




    const data = {
        labels: datalabel,
        datasets: [
            {
                label: 'waiting hour',
                data: displayDate,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 99, 132, 0.2)',

                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 99, 132, 1)',

                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        scales: {
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true,
                    },
                },
            ],
        },
        maintainAspectRatio: true,
    };

    const VerticalBar = () => (
        <div className="hospital-detail-info-chart">
            <div className='hospital-detail-info-chart-titleWrapper'>
                <h6 className='hospital-detail-info-chart-title'>Waiting Time (past 7 days)</h6>
            </div>
            <Bar
                data={data}
                options={options}
            />
        </div>
    );

    return VerticalBar();

}


const HospitalDetail = () => {

    let { locId } = useParams();

    const [comments, setComments] = useState([]);
    const [location, setLocation] = useState(null);
    const [favourite, setFavourite] = useState([]);
    const [sevenDay, setSevenDay] = useState(null);

    const [, setTick] = useState(0);

    useEffect(() => {
        FetchLocation();
        FetchComment();
        FetchFavourite();
        FetchSevenDay();
    }, []);

    const FetchSevenDay = () => {
        fetch('/api/historical/past-7-day/' + locId, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(data => data.json())
            .then(res => {
                if (res.code === 2) {
                    console.log(res)
                    setSevenDay(res.finalData)
                    setTick(tick => tick + 1);

                } else {
                    console.log("fetch comment fail", res)
                }
            })
    }


    const FetchLocation = () => {
        fetch('/api/hospital/' + locId, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(data => data.json())
            .then(res => {
                if (res.code === 2) {
                    console.log(res)
                    setLocation(res.location)
                } else {
                    console.log("fetch comment fail", res)
                }
            })

    }

    const FetchComment = () => {
        fetch('/api/comment/' + locId, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(data => data.json())
            .then(res => {
                if (res.code === 2) {
                    setComments(res.comments)
                } else {
                    console.log("fetch comment fail", res)
                }
            })
    }

    const FetchFavourite = () => {
        fetch('/api/favourite/', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(data => data.json())
            .then(res => {
                if (res.code === 2) {
                    console.log(res)
                    setFavourite(res.favouritePlaces)
                } else {
                    console.log("fetch favourite Places fail", res)
                }
            })
    }

    const CommentSubmit = () => {

        let comment = document.querySelector("#comment-text")
        if (document.querySelector("#comment-form").reportValidity()) {

            fetch('/api/comment', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    locationId: locId,
                    author: sessionStorage.getItem('userName'),
                    comment: comment.value,
                })
            })
                .then(data => data.json())
                .then(res => {
                    if (res.code === 2) {
                        console.log('comment added.')
                    } else {
                        console.log("submit comment fail ", res)
                    }
                })

            let tempComments = comments;

            tempComments.unshift({
                author: sessionStorage.getItem('userName'),
                comment: comment.value,
                creationDate: new Date(),
            })

            setComments(tempComments)
            //fix react not rerender
            setTick(tick => tick + 1);
            comment.value = "";

        }
    }

    const addFavourite = () => {
        let tempFavourite = favourite;

        tempFavourite.indexOf(Number(locId)) === -1 ? tempFavourite.push(Number(locId)) : console.log("This locId already exists");

        fetch('/api/favourite', {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                favourite: tempFavourite,
            })
        })
            .then(data => data.json())
            .then(res => {
                if (res.code === 2) {
                    setFavourite(tempFavourite);
                    setTick(tick => tick + 1);

                } else {
                    console.log("add favourite place fail ", res)
                }
            })

    }

    const removeFavourite = () => {
        let tempFavourite = favourite;
        tempFavourite = tempFavourite.filter(item => item !== Number(locId));

        fetch('/api/favourite', {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                favourite: tempFavourite,
            })
        })
            .then(data => data.json())
            .then(res => {
                if (res.code === 2) {
                    setFavourite(tempFavourite);
                    setTick(tick => tick + 1);

                } else {
                    console.log("remove favourite place fail ", res)
                }
            })

    }


    const content = () =>
        <div className="row">
            <div className="col-lg" style={{ flex: 2 }}>
                <div className="hospital-detail-map">
                    <GoogleMapReact
                        bootstrapURLKeys={{ key: GoogleMapKey, language: 'zh-HK' }}
                        defaultCenter={{
                            lat: location.latitude,
                            lng: location.longitude
                        }}
                        defaultZoom={14}
                        yesIWantToUseGoogleMapApiInternals
                        onGoogleApiLoaded={({ map, maps }) => {
                            new maps.Marker({
                                position: { lat: location.latitude, lng: location.longitude },
                                map,
                                animation: google.maps.Animation.DROP,
                                title: location.name,
                            });
                        }}
                    >
                    </GoogleMapReact>

                </div>

            </div>
            <div className="col-lg">
                <div className="d-flex flex-column hospital-detail-rest">
                    <div className="hospital-detail-info">
                        <div className="d-flex align-items-center justify-content-between hospital-detail-info-header">
                            <h4>Hospital Details</h4>
                            {favourite.includes(Number(locId)) ? <Favorite onClick={() => removeFavourite()} style={{ color: "red", cursor: "pointer" }} /> : <FavoriteBorder onClick={() => addFavourite()} style={{ cursor: "pointer" }} />}
                        </div>
                        <div className="hospital-detail-info-table">
                            <table className="">
                                <tbody>
                                    <tr>
                                        <th>Hospital Name:</th>
                                        <td>{location.name}</td>
                                    </tr>
                                    <tr>
                                        <th>Latitude:</th>
                                        <td>{location.latitude}</td>
                                    </tr>
                                    <tr>
                                        <th>Longitude:</th>
                                        <td>{location.longitude}</td>
                                    </tr>
                                    <tr>
                                        <th>Waiting Time:</th>
                                        <td>{location.waitTime.waitingTime}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="hospital-detail-info-chartswrapper d-flex flex-column justify-content-between align-items-center">
                            <HistoricalDataHour />
                            {sevenDay ? <HistoricalDataDay dataSets={sevenDay} /> : null}
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <div className="my-5 hospital-detail-comment">

                    <div className="hospital-detail-comment-title">
                        <h4>Comments</h4>
                    </div>
                    <div className="hospital-detail-comment-text">
                        <form id="comment-form">
                            <textarea className="form-control" id="comment-text" rows="2" placeholder="Please input your comment here..." required ></textarea>

                            <div className="d-flex justify-content-end">
                                <button type="button" className="btn btn-success" onClick={CommentSubmit}>post</button>
                            </div>
                        </form>
                    </div>

                    <div className="hospital-detail-comment-area">
                        {comments.map((comment, index) => {
                            return (
                                <div className="d-flex flex-row my-3 hospital-detail-comment-box" key={index}>
                                    <EmojiEmotions className="hospital-detail-comment-icon" />
                                    <div className="hospital-detail-comment-body">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="mx-2 hospital-detail-comment-author">{comment.author}</div>
                                            <span className="mx-2 hospital-detail-comment-date">{new Date(comment.creationDate).toLocaleString('en-US')}</span>
                                        </div>
                                        <p className="hospital-detail-comment-conent mx-2">{comment.comment}</p>
                                    </div>

                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>



    return (
        location ?
            content() : null
    )
}

export default HospitalDetail;
