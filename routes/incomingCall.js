const express = require("express");
const router = express.Router();
const VoiceResponse = require('twilio').twiml.VoiceResponse;

router.get("/", async(req,res) => {
  res.json({msg:"incoming call work!"})
})

router.post("/voice", async(req,res)=>{
    const twiml = new VoiceResponse();
    twiml.play("https://call-project.cyclic.app/Rev.mp3");

    const gather = twiml.gather({ numDigits: 1 });
    gather.say('For sales, press 1. For support, press 2.');

    twiml.redirect("/voice");

    
    // res.writeHead(200, { 'Content-Type': 'text/xml' });
    // res.end(twiml.toString());
    // res.end(twiml.toString());
    // res.json({msg:twiml.toString()})
    res.type('text/xml');
    res.send(twiml.toString());

})
router.get("/test", async(req,res)=>{
    res.json({msg:"test work2!"})
})

module.exports = router;