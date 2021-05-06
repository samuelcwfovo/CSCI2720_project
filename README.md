# CSCI2720_project

## Setup Method
**Ray: "The method was found by myself. Since I am bad (taken much time to figure out how to setup), the setup method might not be completed and correct. If there is any mistake, the initializer, Samuel or anyone else please feel free to correct the setup method. Thank you very much!"**<br><br>
**The setup is hosted locally on Windows. Ignore the setup method if you have already setup everything**<br>
1. Install Node.js for Windows
2. Install Mongodb for Windows
3. Download the whole set from Github<br>
4. Unzip the locate /src in your custom directory<br>
5. Use cmd to cd to /*custom directory*/src<br>
6. Install all node module: **npm install**
7. Development envirnment: **npm run dev** (all stuff will auto start. and it will auto detect server/client side code change)
8. Production envirnment: **npm run build**
9. cd to /server and run the server by: **node index.js** (only when you need to run it on Production envirnment and node server wasn't start)
10. Pray that the server is successfully setup
11. Use browser: **http://127.0.0.1:2060/** to check whether it is successful
=======

## Tasks
**Ray: "Feel free to add missing tasks if there is one!"**<br><br>
#### Generals
- [ ] Create chart: Waiting time in the past 10 hours
- [ ] Create chart: Waiting time in this hour of past 7 days
- [x] Setup everything on one of our 2720 VM after all codes are completed

#### User Actions
- [x] List all places in a table, and allow sorting of the table with one of the listed fields, linking to single places
- [x] Show all ~~available~~ places in a map, with links to each single place (Suggested APIs: Google Maps, MapBox)
- [x] Search for places which contain keywords in one field chosen by the user which will result in a table of place results
- [x] A separate view for one single place, containing:<br>
      a. a map showing the place<br>
      b. the place details<br>
      c. user comments, where users can add new comments (non-threaded)<br>
      
- [ ] Add place into a list of user’s favourite places, and see the list in another view (flexible implementation)
- [x] See the username in the top left/right of screen, and be able to log out **(Done by Samual)**

#### Admin Actions
- [x] Refresh data, i.e. reload from the online dataset, without affecting data which does not come from API (e.g. user comments within your app) **(Done by Ray)**

- [x] CRUD place data in the local database
- [x] CRUD user data (username and password only) in the local database
- [x] Log out as admin

#### Non-user actions:
- [x] Log in as user with username and password **(Done by Samual)**
- [x] Log in as admin using username and password both as admin (Shall be implemented to the db in 2720 VM after all codes are completed
)
