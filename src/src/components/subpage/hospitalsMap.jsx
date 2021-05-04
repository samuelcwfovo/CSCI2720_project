import React, { useState, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';
import { GoogleMapKey } from '../../assets/key.jsx';
import '../../assets/css/hospitalsMap.css';


import { LocalHospitalTwoTone } from '@material-ui/icons';






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
                    console.log(res.hospitals)
                    setLocations(res.hospitals)
                } else {
                    console.log("fetch hospital data fail", res)
                }
            })

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
                infoWindow.setContent(
                    '<div class="marker-content">' +
                        '<p>' + element.name + '</p>' +
                        '<a href="/dashboard/hospitals/' + element.locId + '">details</a>' +
                    '</div>'
                );
                infoWindow.open(marker.getMap(), marker);
            })
        })
    };


    const content = () => {
        return (
            <div className="hospitals-map-content d-flex">
                <GoogleMapReact
                    bootstrapURLKeys={{ key: GoogleMapKey }}
                    defaultCenter={{
                        lat: 22.31930137022674,
                        lng: 114.16997366890004
                    }}
                    defaultZoom={10}
                    yesIWantToUseGoogleMapApiInternals
                    onGoogleApiLoaded={({ map, maps }) => apiIsLoaded(map, maps, locations)}
                >
                </GoogleMapReact>
            </div>
        )
    }


    return (
        <>
            {locations.length > 0 ? content() : null}
        </>
    )
}

export default HospitalsMap;
