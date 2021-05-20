//---------------------------------------------------
// Cheng Yun Chueng 1155109570
// Wong Kong Wa 1155127049
// Chow Wang Faat 1155115793
// Lau Pak Hei Anson 1155158646
//---------------------------------------------------

const express = require('express');
require('dotenv').config();

const app = express();

let cached = global.mongo

if (!cached) {
    cached = global.mongo = { conn: null, promise: null }
}

async function connectToDatabase() {
    if (cached.conn) {
        console.log("db cached")
        return cached.conn
    }

    if (!cached.promise) {
        const opts = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }

        // cached.promise = MongoClient.connect("mongodb+srv://samuel:534106@auth.v9g56.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", opts).then((client) => {
        //     return {
        //         client,
        //         db: client.db("test"),
        //     }
        // })
        cached.promise = mongoose.connect("mongodb+srv://samuel:534106@cluster0.tqy8t.mongodb.net/project?retryWrites=true&w=majority", opts).then((client) => {
            return {
                client
            }
        })
    }

    console.log("db not cache")

    cached.conn = await cached.promise
    return cached.conn
}


const db = connectToDatabase();

app.use(async function (req, res, next) {
    await connectToDatabase();
    next();
  });
  

app.use(require('./routes/api'));

app.use(require('./routes/website'));

app.listen(process.env.PORT);
