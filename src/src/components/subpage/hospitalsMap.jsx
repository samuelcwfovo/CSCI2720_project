import React from 'react';
import GoogleMapReact from 'google-map-react';
import { GoogleMapKey } from '../../assets/key.jsx';

const AnyReactComponent = ({ text }) => <div>{text}</div>;



const HospitalsMap = () => {
    return (
        <div>
            <h1>Hospitals Manage</h1>
            <div style={{ height: '100vh', width: '100%' }}>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: GoogleMapKey }}
                    defaultCenter={{
                        lat: 59.95,
                        lng: 30.33
                    }}
                    defaultZoom={11}
                >
                    <AnyReactComponent
                        lat={59.955413}
                        lng={30.337844}
                        text="My Marker"
                    />
                </GoogleMapReact>
            </div>
        </div >
    )
}

export default HospitalsMap;