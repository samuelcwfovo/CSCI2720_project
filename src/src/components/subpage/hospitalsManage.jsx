import React from 'react';

const Refresh = () => {
    fetch('/api/admin/refresh', {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(data => data.json())
        .then(res => {
            if (res.code === 1) {
                console.log("refresh failed", res)
            }
            if (res.code === 2) {
                console.log("refresh succeeded", res)
            }
        })
}

const HospitalsManage = () => {
    return (
        <div>
            <h1>Hospitals Manage</h1>
            <button type="button" className="btn btn-info" onClick={Refresh}>Refresh Data</button>
        </div>
    )
}


export default HospitalsManage
