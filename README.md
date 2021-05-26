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
- Login /Logut
- Login rember me (token)
- Token Based Authentication (api call)
- Handle page redirect and page auth check with React router dom
- Fetch Hospital info from government open data (data.gov.hk)
- Display hospitals location in Google Map
- Display hospitals wait time on table
- Table sortable and searchable with whole table or specific field
- Display hospital wait time history with chart (past 10 hours/ past 7 days)
- Available to add hospital to favourite list and see the list in another view
- Leave comment on different hospital
- Admin panel to CRUD user/ hospital data
