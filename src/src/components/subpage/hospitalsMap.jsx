import React, { useState, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';
import { GoogleMapKey } from '../../assets/key.jsx';


import { LocalHospitalTwoTone } from '@material-ui/icons';



const Mark = () => {
    return (
        <div><LocalHospitalTwoTone className="fs-1  text-danger " /></div>
    )
}

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
    if (map) {
        const bounds = getMapBounds(map, maps, locations);
        map.fitBounds(bounds);
        bindResizeListener(map, maps, bounds);
    }
};


const HospitalsMap = () => {

    const [locations, setLocations] = useState({});

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
                    setLocations(res.hospitals)
                } else {
                    console.log("fetch hospital data fail", res)
                }
            })

    }


    return (
        <div>
            <div style={{ height: '50vh', width: '100%' }}>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: GoogleMapKey }}
                    defaultCenter={{
                        lat: 22.31930137022674,
                        lng: 114.16997366890004
                    }}
                    defaultZoom={11}
                    yesIWantToUseGoogleMapApiInternals
                    onGoogleApiLoaded={({ map, maps }) => apiIsLoaded(map, maps, locations)}
                >
                    {locations.forEach((element, index) => {
                        <Mark
                            key={index}
                            lat={element.latitude}
                            lng={element.longitude}
                        />
                    })}
                </GoogleMapReact>


            </div>
        </div >
    )
}

export default HospitalsMap;
