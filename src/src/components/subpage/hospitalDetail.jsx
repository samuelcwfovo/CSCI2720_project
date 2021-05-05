import React, { useState, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';
import { useParams } from "react-router-dom";

import { GoogleMapKey } from '../../assets/key.jsx';
import '../../assets/css/hospitalDetail.css';
import { Favorite, FavoriteBorder, EmojiEmotions } from '@material-ui/icons';


const HospitalDetail = () => {

    let { locId } = useParams();

    const [comments, setComments] = useState([]);
    const [location, setLocation] = useState(null);

    const [, setTick] = useState(0);

    useEffect(() => {
        FetchLocation();
        FetchComment();

    }, []);

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


        }
    }


    const content = () =>
        <div className="row">
            <div className="col-lg" style={{ flex: 2 }}>
                <div className="hospital-detail-map">
                    <GoogleMapReact
                        bootstrapURLKeys={{ key: GoogleMapKey }}
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
                <div className="d-flex flex-column">
                    <div>
                        <div className="d-flex align-items-center justify-content-between">
                            <h4>Hospital Details</h4>
                            <FavoriteBorder />
                        </div>
                        <div className="hospital-detail-table">
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
                                        <th>Wait Time:</th>
                                        <td>{location.waitTime.waitingTime}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="my-3">
                        <h4>Comments</h4>

                        <div>
                            <h5>Your Comment</h5>
                            <form id="comment-form">
                                <textarea className="form-control" id="comment-text" rows="3" required></textarea>

                                <button type="button" className="btn btn-outline-info" onClick={CommentSubmit}>Info</button>
                            </form>
                        </div>


                        {comments.map((comment, index) => {
                            return (
                                <div className="d-flex flex-row my-3" key={index}>
                                    <EmojiEmotions className="comment-pic mx-3" />
                                    <div className="comment-body">
                                        <div className="commentHeader d-flex">
                                            <div className="commentAuthor mx-2">{comment.author}</div>
                                            <span className="comment-date mx-2">{new Date(comment.creationDate).toLocaleString('en-US')}</span>
                                        </div>
                                        <span className="comment-content mx-2">{comment.comment}</span>
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
