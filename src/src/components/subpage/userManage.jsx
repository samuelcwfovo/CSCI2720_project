import React from 'react';

class UserManage extends React.Component{
	
	constructor(props) {
      super(props);

      this.state = {
        data : null
      };
    }
	
	componentWillMount(){
		fetch('/api/admin/getusers', {
			method: 'POST',
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
				this.setState({ data : res['users'] })
            }
        }).catch((error) => console.error(error));
    }

	render(){
		return(
			<div>
				<h1>Users Manage</h1>
					<table>
						<thead><tr><th> User ID </th><th> Username </th><th> Operations </th></tr></thead>
						<tbody>
							{this.state.data ? Object.keys(this.state.data).map(key => 
								<tr><td>{this.state.data[key]['userId']}</td>
								<td>{this.state.data[key]['userName']}</td></tr>
								) : <tr><td>Loading</td></tr>}
						</tbody>
					</table>
			</div>
		)
	}
}

export default UserManage
