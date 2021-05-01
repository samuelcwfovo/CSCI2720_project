# CSCI2720_project

## Setup Method
**Ray: "The method was found by myself. Since I am bad (taken much time to figure out how to setup), the setup method might not be completed and correct. If there is any mistake, the initializer, Samuel or anyone else please feel free to correct the setup method. Thank you very much!"**<br><br>
**The setup is hosted locally on Windows. Ignore the setup method if you have already setup everything**<br>
1. Install Node.js for Windows
2. Install Mongodb for Windows
3. Download the whole set from Github<br>
4. Unzip the locate /src in your custom directory<br>
5. Use cmd to cd to /*custom directory*/src<br>
6. Initialize node.js by command: **npm init**
7. Install express: **npm install express --save**
8. Install mongoose: **npm install mongoose --save**
9. Install webpack: **npm install webpack webpack-cli --save-dev**
10. Build the html bundle: **npm run build** (need to run this command every time after you update codes in /src I guess)
11. cd to /server and run the server by: **node index.js**
12. Pray that the server is successfully setup
13. Use browser: **http://127.0.0.1:3000/** to check whether it is successful

## Tasks
**Ray: "Feel free to add missing tasks if there is one!"**<br><br>
#### Generals
- [ ] Basic fetches of data from API
- [ ] Create chart: Waiting time in the past 10 hours
- [ ] Create chart: Waiting time in this hour of past 7 days
- [ ] Setup everything on one of our 2720 VM after all codes are completed

#### User Actions
- [ ] List all places in a table, and allow sorting of the table with one of the listed fields, linking to single places
- [ ] Show all available places in a map, with links to each single place (Suggested APIs: Google Maps, MapBox)
- [ ] Search for places which contain keywords in one field chosen by the user which will result in a table of place results
- [ ] A separate view for one single place, containing:<br>
      a. a map showing the place<br>
      b. the place details<br>
      c. user comments, where users can add new comments (non-threaded)<br>
      
- [ ] Add place into a list of user’s favourite places, and see the list in another view (flexible implementation)
- [ ] See the username in the top left/right of screen, and be able to log out

#### Admin Actions
- [ ] Refresh data, i.e. reload from the online dataset, without affecting data which does not come from API (e.g. user comments within your app)
- [ ] CRUD place data in the local database
- [ ] CRUD user data (username and password only) in the local database
- [ ] Log out as admin

#### Non-user actions:
- [x] Log in as user with username and password **(Done by Samual)**
- [ ] Log in as admin using username and password both as admin (Shall be implemented to the db in 2720 VM after all codes are completed
)

## Logs

Samuel: Initial upload.<br><br>
Samuel: Completed Login and Sign Up pages.<br><br>
Samuel: Initialized Main page.<br><br>
Ray: Created README.md.<br><br>
Anson: Uploaded module: retrive-hospital-data.js