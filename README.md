# CSCI2720_project

## AE Time
 - build a webapplication for checking Hong Kong Emergency department waiting time. You can get the detail from **Project Document.pdf**

## Tech We use
1. Express.js
2. Webpack js
3. React js

## Require Environment
1. Node.js
2. MongoDB

## Setup Method
1. cd /src<br>
2. Install all node module: **npm install**
3. Set Up **PORT** and **DB_URL** in **src/.env**
4. Development envirnment
   - ```npm run dev```
6. Production envirnment
```bash
npm run build # build code s
npm run start # run node server
```
1. Browser access: **http://127.0.0.1:PORT/** 

## Screens Shot


## Required Tasks <br>
#### Generals
- [x] Create chart: Waiting time in the past 10 hours
- [x] Create chart: Waiting time in this hour of past 7 days
- [x] Setup everything on one of our 2720 VM after all codes are completed

#### User Actions
- [x] List all places in a table, and allow sorting of the table with one of the listed fields, linking to single places
- [x] Show all ~~available~~ places in a map, with links to each single place (Suggested APIs: Google Maps, MapBox)
- [x] Search for places which contain keywords in one field chosen by the user which will result in a table of place results
- [x] A separate view for one single place, containing:<br>
      a. a map showing the place<br>
      b. the place details<br>
      c. user comments, where users can add new comments (non-threaded)<br>
      
- [x] Add place into a list of user’s favourite places, and see the list in another view (flexible implementation)
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
