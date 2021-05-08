//---------------------------------------------------
// Cheng Yun Chueng 1155109570
// Wong Kong Wa 1155127049
// Chow Wang Faat 1155115793
// Lau Pak Hei Anson 1155158646
//---------------------------------------------------

import React, { useState, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';
import MUIDataTable from "mui-datatables";
import { Link, useHistory } from 'react-router-dom';

import { GoogleMapKey } from '../../assets/key.jsx';
import '../../assets/css/hospitalsMap.css';



const HospitalsMap = () => {

    const [locations, setLocations] = useState([]);

    useEffect(() => {
        getLocationData();
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



    return (
        locations.length > 0 ?
            <div className="row ">
                <div className="col-lg" style={{ flex: 2 }}>
                    <MapContent locations={locations} />
                </div>
                <div className="col-lg">
                    <TableContent locations={locations} />
                </div>
            </div>
            : null

    )

}



const MapContent = (props) => {
    let history = useHistory();

    const getMapBounds = (map, maps, locations) => {
        const bounds = new maps.LatLngBounds();

        locations.forEach((location) => {
            bounds.extend(
                new maps.LatLng(location.latitude, location.longitude),
            );
        });
        return bounds;
    };

    const bindResizeListener = (map, maps, bounds) => {
        maps.event.addDomListenerOnce(map, 'idle', () => {
            maps.event.addDomListener(window, 'resize', () => {
                map.fitBounds(bounds);
            });
        });
    };

    const apiIsLoaded = (map, maps, locations) => {
        const bounds = getMapBounds(map, maps, locations);
        map.fitBounds(bounds);
        bindResizeListener(map, maps, bounds);

        const infoWindow = new maps.InfoWindow();

        locations.map(element => {
            const marker = new maps.Marker({
                position: { lat: element.latitude, lng: element.longitude },
                map,
                animation: google.maps.Animation.DROP,
                title: element.name,
            });

            marker.addListener("click", () => {
                infoWindow.close();

                let detail = document.createElement('div');
                detail.className = "marker-content-detail";
                detail.innerText = "details"
                detail.onclick = () => {
                    history.push({
                        pathname: "/dashboard/hospitals/" + element.locId
                    });
                };

                let div = document.createElement('div');
                div.className = "marker-content";
                div.innerHTML = '<p>' + element.name + '</p>' + '<p>' + element.waitTime.waitingTime + '</p>';
                div.appendChild(detail);

                infoWindow.setContent(div);
                infoWindow.open(marker.getMap(), marker);
            })
        })
    };


    return (
        <div className="hospitals-map-content">
            <GoogleMapReact
                bootstrapURLKeys={{ key: GoogleMapKey, language: 'zh-HK' }}
                defaultCenter={{
                    lat: 22.31930137022674,
                    lng: 114.16997366890004
                }}
                defaultZoom={10}
                yesIWantToUseGoogleMapApiInternals
                onGoogleApiLoaded={({ map, maps }) => apiIsLoaded(map, maps, props.locations)}
            >
            </GoogleMapReact>
        </div>
    )
}


const TableContent = (props) => {

    const columns = [
        {
            name: "Hospitals",
            options: {
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <Link to={{
                            pathname: "/dashboard/hospitals/" + tableMeta.rowData[2]
                        }} >
                            {value}
                        </Link>
                    )
                }
            }
        },
        {
            name: 'Wait Time',
            lable: 'Wait Time',
            option: {},
        },
        {
            name: 'locId',
            options: {
                display: 'excluded',
                filter: false,
            }
        }
    ];

    let data = []
    props.locations.forEach(element => {
        data.push({ "Hospitals": element.name, "Wait Time": element.waitTime ? element.waitTime.waitingTime : "", 'locId': element.locId })
    });

    const options = {
        responsive: 'standard',
        print: false,
        download: false,
        viewColumns: false,
        filter: true,
        selectableRowsHideCheckboxes: true,
        filterType: 'textField',
        rowsPerPage: 50,
    };

    return (
        <MUIDataTable className="my-2 my-lg-0 hospitals-map-table"
            title={"Hospitals List"}
            data={data}
            columns={columns}
            options={options}
            tableBodyHeight="100%"
        />
    )
}








export default HospitalsMap;
