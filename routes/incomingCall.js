const express = require("express");
const router = express.Router();
const VoiceResponse = require('twilio').twiml.VoiceResponse;

router.get("/", async(req,res) => {
  res.json({msg:"incoming call work!"})
})
router.get("/incoming", async(req,res)=>{
    const twiml = new VoiceResponse();
    twiml.say('Hello from your pals at Twilio! Have fun.');
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
    // res.end(twiml.toString());
    // res.json({msg:twiml.toString()})

})
router.get("/test", async(req,res)=>{
    res.json({msg:"test work!"})
})

module.exports = router;