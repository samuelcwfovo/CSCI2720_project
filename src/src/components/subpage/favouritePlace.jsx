//---------------------------------------------------
// Cheng Yun Chueng 1155109570
// Wong Kong Wa 1155127049
// Chow Wang Faat 1155115793
// Lau Pak Hei Anson 1155158646
//---------------------------------------------------

import React, { useState, useEffect } from 'react';
import '../../assets/css/favourite.css';
import { Link } from 'react-router-dom';

import { DataGrid } from '@material-ui/data-grid';

const FavouritePlace = () => {

    const [locations, setLocations] = useState(null);
    const [favourite, setFavourite] = useState(null);

    useEffect(() => {
        getLocationData();
        fetchFavourite();
    }, []);

    const getLocationData = () => {
        fetch('/api/hospital', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(data => data.json())
            .then(res => {
                if (res.code === 2) {
                    console.log("hospitals", res.hospitals)
                    setLocations(res.hospitals)
                } else {
                    console.log("fetch hospital data fail", res)
                }
            })

    }

    const fetchFavourite = () => {
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

    const renderHospitalCell = (params) => {
        return (
            <Link to={"/dashboard/hospitals/" + params.id} className="favourite-cell">
                {params.value}
            </Link>
        )
    }

    const renderTimeCell = (params) => {
        return (
            <span className="favourite-cell">
                {params.value}
            </span>
        )
    }


    const columns = [
        {
            field: "name",
            headerName: "Hospital Name",
            flex: 1.5,
            renderCell: renderHospitalCell,
        },
        {
            field: "time",
            headerName: "Waiting Time",
            flex: 1,
            renderCell: renderTimeCell,
        },
    ]

    const getRows = () => {
        let data = locations.filter(location => favourite.includes(location.locId));

        data.forEach(element => {
            element.time = element.waitTime ? element.waitTime.waitingTime : "";
            element.id = element.locId;
        })

        return data
    }




    const content = () => {
        console.log(getRows())
        return (
            <div className="favourite-place-table">
                <DataGrid autoHeight rows={getRows()} columns={columns} />
            </div>
        );
    }


    return (
        (locations && favourite) ?
            content() : null
    )

}


export default FavouritePlace