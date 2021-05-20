# CSCI2720_project

## AE Time
 - Build a web application for checking Hong Kong Emergency department waiting time. You can get the detail from **Project Document.pdf**.
 - This is a group project in CUHK course CSCI2720 (Building Web Applications). Alought it is a group project, i did almost 80~90% part since my poor groupmates have no idea how to handle react/nodeJS (or maybe they are busying in other stuff). Only 1 gpmate can help me code the hospital/user CRUD part. 

## Hosting
 - Link: https://csci-2720-project.vercel.app/
 - I hosted it on Amazon using aws serverless service with Vercel platform. At first I deploy it on google clould platform with docker file. Then I found that serverless is better since serverless are free forever.
 - Sometime it load a bit slow, that is because it need to create DB connection on every api request (cached already, but it can't last for long period).
 - It was quite fun to learn and deploy this project to serverless.

## npm package I use
1. Express.js
2. Webpack js
3. React js
4. react router dom
5. Google map react
6. jwt token
7. ...

## Require Environment
1. Node.js
2. MongoDB

## Setup Method
1. cd /src<br>
2. Install all node module: **npm install**
3. Set Up **PORT** and **DB_URL** in **src/.env**
4. Set UP Google Map key in src/src/assets/key.jsx
5. Development envirnment
```
npm run dev
```
6. Production envirnment
```bash
npm run build # build code 
npm run start # run node server
```
1. Browser access: **http://127.0.0.1:PORT/** 

## Screens Shot
#### Desktop
<p float="left">
 <img src="https://github.com/samuelcwfovo/CSCI2720_project/blob/main/markdown-png/destop.png" alt="Desktop" width="200" height= "112"/>
 <img src="https://github.com/samuelcwfovo/CSCI2720_project/blob/main/markdown-png/destop-login.png" alt="Desktop-login" width="200" height= "112"/>
 <img src="https://github.com/samuelcwfovo/CSCI2720_project/blob/main/markdown-png/destop-main.png" alt="Desktop-main" width="200" height= "112"/>
 <img src="https://github.com/samuelcwfovo/CSCI2720_project/blob/main/markdown-png/destop-detail.png" alt="Desktop-detail" width="200" height= "112"/>
</p>

#### Mobile
<p float="left">
 <img src="https://github.com/samuelcwfovo/CSCI2720_project/blob/main/markdown-png/mobile.png" alt="mobile" width="100"/>
 <img src="https://github.com/samuelcwfovo/CSCI2720_project/blob/main/markdown-png/mobile-login.png" alt="mobile-login" width="100"/>
 <img src="https://github.com/samuelcwfovo/CSCI2720_project/blob/main/markdown-png/mobile-main.png" alt="mobile-main" width="100"/>
 <img src="https://github.com/samuelcwfovo/CSCI2720_project/blob/main/markdown-png/mobile-detail.png" alt="mobile-detail" width="100"/>
</p>

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
