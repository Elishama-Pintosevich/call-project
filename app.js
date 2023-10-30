require("dotenv").config()
const http = require('http')
const express = require("express")
const app = express()
const path = require("path");

app.use(express.json())

const {routesInit} = require("./routes/configRoutes")

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.TOKEN_SID;
const client = require('twilio')(accountSid, authToken);
const cors = require("cors")

routesInit(app);
app.use(cors())

app.use(express.static(path.join(__dirname, "public")));

function createCall(){
    client.calls
      .create({
         url: 'http://demo.twilio.com/docs/voice.xml',
         to: '+972545515233',
         from: '+97223760076'
       })
      .then(call => console.log(call.sid));
}
const server = http.createServer(app)
const port = process.env.PORT || 3002
server.listen(port)
