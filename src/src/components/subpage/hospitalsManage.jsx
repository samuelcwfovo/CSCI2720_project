//---------------------------------------------------
// Cheng Yun Chueng 1155109570
// Wong Kong Wa 1155127049
// Chow Wang Faat 1155115793
// Lau Pak Hei Anson 1155158646
//---------------------------------------------------

import React from 'react';
import { Dropdown } from 'react-bootstrap';

class HospitalsManage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            data: null,
        };
    }

    refresh = () => {
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
                    alert("Please refresh to see the updated table.");
                    console.log("refresh succeeded", res);
                }
            })
    }

    getHospital() {
        fetch('/api/admin/hospital', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(data => data.json())
            .then(res => {
                if (res.code === 0) {
                    console.log("internal errors", res)
                }
                if (res.code === 1) {
                    console.log("get hospitals failed", res)
                }
                if (res.code === 2) {
                    console.log("get hospitals succeeded", res)
                    this.setState({ data: res['hospitals'] })
                }
            }).catch((error) => console.error(error));
    }

    componentWillMount() {
        this.getHospital();
    }

    createHospital = () => {
        var max = -1;
        const ids = Object.keys(this.state.data).map((key) =>
            this.state.data[key]['locId']
        )

        max = ids.reduce((a, c) => a < c ? c : a)

        let f = document.getElementById("create");

        if (!parseFloat(f.elements.latitude.value) || !parseFloat(f.elements.longitude.value)) {
            alert("Please enter valid data to create");
            return
        }

        const wts = "Around " + f.elements.waitingtime.value + (f.elements.waitingtime.value == 1 ? " hour" : " hours")

        fetch('/api/admin/hospital', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                locId: max + 1,
                name: f.elements.name.value,
                latitude: parseFloat(f.elements.latitude.value),
                longitude: parseFloat(f.elements.longitude.value),
                wt: wts
            })
        })
            .then(data => data.json())
            .then(res => {
                if (res.code === 0) {
                    console.log("internal errors", res)
                }
                if (res.code === 1) {
                    console.log("create hospital failed", res)
                    alert("Please enter valid data to create hospital");
                }
                if (res.code === 2) {
                    console.log("create hospital succeeded", res)
                    alert("New Hospital Created");
                    this.getHospital();
                }
            }).catch((error) => console.error(error));
    }

    updateHospital = id => () => {
        let f = document.getElementById("update-" + id);
        console.log("update-id: " + id);

        if (f.elements.latitude.value && (!parseFloat(f.elements.latitude.value)) || (f.elements.longitude.value && !parseFloat(f.elements.longitude.value))) {
            alert("Please enter valid data to update");
            return
        }

        fetch('/api/admin/hospital', {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                condition: {
                    locId: id,
                },
                new: {
                    locId: { value: id, update: false },
                    name: { value: f.elements.name.value, update: f.elements.name.value ? true : false },
                    latitude: { value: parseFloat(f.elements.latitude.value), update: parseFloat(f.elements.latitude.value) ? true : false },
                    longitude: { value: parseFloat(f.elements.longitude.value), update: parseFloat(f.elements.longitude.value) ? true : false },
                }
            })
        })
            .then(data => data.json())
            .then(res => {
                if (res.code === 0) {
                    console.log("internal errors", res)
                    alert("Hospital Data Failed to Updated");
                }
                if (res.code === 1) {
                    console.log("update hospital failed", res)
                    alert("Hospital Data Failed to Updated");
                }
                if (res.code === 2) {
                    console.log("update hospital succeeded", res)
                    this.getHospital();
                    alert("Hospital Data Updated");
                }
            }).catch((error) => console.error(error));
    }

    deleteHospital = id => () => {
        console.log(id);

        fetch('/api/admin/hospital', {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                locId: id,
            })
        })
            .then(data => data.json())
            .then(res => {
                if (res.code === 0) {
                    console.log("internal errors", res)
                }
                if (res.code === 1) {
                    console.log("delete hospital failed", res)
                }
                if (res.code === 2) {
                    console.log("delete hospital succeeded", res)
                    this.getHospital();
                    alert("Hospital Deleted");
                }
            }).catch((error) => console.error(error));
    }

    render() {
        return (
            <div>
                <h1>Hospitals Manage</h1>
                <div className="d-flex justify-content-between">
                    <Dropdown>
                        <Dropdown.Toggle variant="primary">
                            Create New Hospital
							</Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Header>
                                <form id="create">
                                    <div className="py-3 mx-3 width-auto">
                                        <label htmlFor="update-name">New Hospital Name</label>
                                        <input type="text" name="name" className="form-control" id="update-name" placeholder="Hospital Name" required />
                                    </div>

                                    <div className="py-3 mx-3 width-auto">
                                        <label htmlFor="update-latitude">New Latitude</label>
                                        <input type="text" name="latitude" className="form-control" id="update-latitude" placeholder="Latitude" required />
                                    </div>

                                    <div className="py-3 mx-3 width-auto">
                                        <label htmlFor="update-longitude">New longitude</label>
                                        <input type="text" name="longitude" className="form-control" id="update-longitude" placeholder="Longitude" required />
                                    </div>
                                    <div className="py-3 mx-3 width-auto">
                                        <label htmlFor="update-waitingtime">Waiting Time</label>
                                        <input type="number" name="waitingtime" className="form-control" id="update-waitingtime" placeholder="Waiting Time" required />
                                    </div>
                                    <div className="py-5 mx-3">
                                        <button type="button" className="btn btn-primary btn-outline-light" onClick={this.createHospital}>Create</button>
                                    </div>
                                </form>
                            </Dropdown.Header>
                        </Dropdown.Menu>
                    </Dropdown>
                    <button type="button" className="btn btn-info" onClick={this.refresh}>Refresh Data</button>

                </div>
                <br /><h2>Hospitals Table</h2>
                <div className="table-responsive">
                    <table className="table text-dark bg-transparent">
                        <thead><tr><th> Hospital ID </th><th> Hospital Name </th><th> Latitude / Longitude </th><th> Operations </th></tr></thead>
                        <tbody style={{ 'overflowX': 'scroll' }}>
                            {this.state.data ? Object.keys(this.state.data).map((key, index) =>
                                <tr key={index}><td>{this.state.data[key]['locId']}</td>
                                    <td>{this.state.data[key]['name']}</td>
                                    <td>{this.state.data[key]['latitude']} / {this.state.data[key]['longitude']}</td>
                                    <td>
                                        <Dropdown>
                                            <Dropdown.Toggle variant="success">
                                                Update Hospital
										</Dropdown.Toggle>

                                            <Dropdown.Menu>
                                                <Dropdown.Header>
                                                    <form id={"update-" + this.state.data[key]['locId']}>
                                                        <div className="py-3 mx-3 width-auto">
                                                            <label htmlFor="update-name">New Hospital Name</label>
                                                            <input type="text" name="name" className="form-control" id="update-name" placeholder="Hospital Name" />
                                                        </div>

                                                        <div className="py-3 mx-3 width-auto">Or</div>

                                                        <div className="py-3 mx-3 width-auto">
                                                            <label htmlFor="update-latitude">New Latitude</label>
                                                            <input type="text" name="latitude" className="form-control" id="update-latitude" placeholder="Latitude" />
                                                        </div>

                                                        <div className="py-3 mx-3 width-auto">Or</div>

                                                        <div className="py-3 mx-3 width-auto">
                                                            <label htmlFor="update-longitude">New longitude</label>
                                                            <input type="text" name="longitude" className="form-control" id="update-longitude" placeholder="Longitude" />
                                                        </div>
                                                        <div className="py-5 mx-3">
                                                            <button type="button" className="btn btn-success btn-outline-light" onClick={this.updateHospital(this.state.data[key]['locId'])}>Update</button>
                                                        </div>
                                                    </form>
                                                </Dropdown.Header>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                        <button type="button" className="btn btn-danger" onClick={this.deleteHospital(this.state.data[key]['locId'])}>Delete Hospital</button>
                                    </td></tr>
                            ) : <tr><td>Loading</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}


export default HospitalsManage
