//---------------------------------------------------
// Cheng Yun Chueng 1155109570
// Wong Kong Wa 1155127049
// Chow Wang Faat 1155115793
// Lau Pak Hei Anson 1155158646
//---------------------------------------------------

import React from 'react';
import { Dropdown } from 'react-bootstrap';

class UserManage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            data: null
        };
    }

    getUser() {
        fetch('/api/admin/user', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(data => data.json())
            .then(res => {
                if (res.code === 1) {
                    console.log("get users failed", res)
                }
                if (res.code === 2) {
                    console.log("get users succeeded", res)
                    this.setState({ data: res['users'] })
                }
            }).catch((error) => console.error(error));
    }

    componentWillMount() {
        this.getUser();
    }

    createUser = () => {
        let f = document.getElementById("create");

        fetch('/api/admin/user', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: f.elements.username.value,
                password: f.elements.password.value
            })
        })
            .then(data => data.json())
            .then(res => {
                if (res.code === 0) {
                    console.log("internal errors", res)
                }
                if (res.code === 1) {
                    console.log("create user failed", res)
		    alert("Please enter valid Username and Password to create user");
                }
                if (res.code === 2) {
                    console.log("create user succeeded", res)
                    this.getUser();
                    alert("New User Created");
                }
            }).catch((error) => console.error(error));
    }

    updateUser = id => () => {
        let f = document.getElementById("update-" + id);
        console.log("update-id: " + id);

        fetch('/api/admin/user', {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                uid: id,
                username: f.elements.username.value,
                password: f.elements.password.value
            })
        })
            .then(data => data.json())
            .then(res => {
                if (res.code === 0) {
                    console.log("internal errors", res)
                }
                if (res.code === 1) {
                    console.log("update user failed", res)
                }
                if (res.code === 2) {
                    console.log("update user succeeded", res)
                    this.getUser();
                    alert("Username/Password Updated");
                }
            }).catch((error) => console.error(error));
    }

    deleteUser = id => () => {
        fetch('/api/admin/user', {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                uid: id,
            })
        })
            .then(data => data.json())
            .then(res => {
                if (res.code === 0) {
                    console.log("internal errors", res)
                }
                if (res.code === 1) {
                    console.log("delete user failed", res)
                }
                if (res.code === 2) {
                    console.log("delete user succeeded", res)
                    this.getUser();
                    alert("User Deleted");
                }
            }).catch((error) => console.error(error));
    }

    render() {
        return (
            <div>
                <h1>Users Manage</h1>
                <div>
                    <Dropdown>
                        <Dropdown.Toggle variant="primary">
                            Create New User
							</Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Header>
                                <form id="create">
                                    <div className="py-3 mx-3 width-auto">
                                        <label htmlFor="new-username">New Username</label>
                                        <input type="text" name="username" className="form-control" id="update-username" placeholder="New Username" onInput={(e) => e.target.setCustomValidity('')} />
                                    </div>

                                    <div className="py-3 mx-3 width-auto">
                                        <label htmlFor="new-password">New Password</label>
                                        <input type="password" name="password" className="form-control" id="update-password" placeholder="New Password" />
                                    </div>
                                    <div className="py-5 mx-3">
                                        <button type="button" className="btn btn-primary btn-outline-light" onClick={this.createUser}>Create</button>
                                    </div>
                                </form>
                            </Dropdown.Header>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                <br /><h2>Users Table</h2>
                <table className="table text-dark bg-transparent">
                    <thead><tr><th> User ID </th><th> Username </th><th> Operations </th></tr></thead>
                    <tbody>
                        {this.state.data ? Object.keys(this.state.data).map((key, index) =>
                            <tr key={index}><td>{this.state.data[key]['userId']}</td>
                                <td>{this.state.data[key]['userName']}</td>
                                <td>
                                    <Dropdown>
                                        <Dropdown.Toggle variant="success">
                                            Update User
										</Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            <Dropdown.Header>
                                                <form id={"update-" + this.state.data[key]['userId']}>
                                                    <div className="py-3 mx-3 width-auto">
                                                        <label htmlFor="update-username">New Username</label>
                                                        <input type="text" name="username" className="form-control" id="update-username" placeholder="New Username" onInput={(e) => e.target.setCustomValidity('')} />
                                                    </div>

                                                    <div className="py-3 mx-3 width-auto">Or</div>

                                                    <div className="py-3 mx-3 width-auto">
                                                        <label htmlFor="update-password">New Password</label>
                                                        <input type="password" name="password" className="form-control" id="update-password" placeholder="New Password" />
                                                    </div>
                                                    <div className="py-5 mx-3">
                                                        <button type="button" className="btn btn-success btn-outline-light" onClick={this.updateUser(this.state.data[key]['userId'])}>Update</button>
                                                    </div>
                                                </form>
                                            </Dropdown.Header>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    <button type="button" className="btn btn-danger" onClick={this.deleteUser(this.state.data[key]['userId'])}>Delete User</button>
                                </td></tr>
                        ) : <tr><td>Loading</td></tr>}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default UserManage
