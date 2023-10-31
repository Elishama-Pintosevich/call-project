const express = require("express");
const router = express.Router();
const VoiceResponse = require('twilio').twiml.VoiceResponse;

router.get("/", async(req,res) => {
  res.json({msg:"incoming call work!"})
})

router.post("/voice1", async(req,res)=>{
    const twiml = new VoiceResponse();
    // twiml.play("https://call-project.cyclic.app/Rev.mp3");

    function gather() {
      const gatherNode = twiml.gather({ numDigits: 1 });
      gatherNode.play("https://call-project.cyclic.app/Rev.mp3");
      gatherNode.say('For sales, press 1. For support, press 2.');
      twiml.redirect({
        method: 'POST'
    }, 'https://call-project.cyclic.app/incomingCall/voice');
    }
    if (req.body.Digits) {
      switch (req.body.Digits) {
        case '1':
          twiml.say('You selected sales. Good for you!');
          break;
        case '2':
          twiml.say('You need support. We will help!');
          break;
        default:
          twiml.say("Sorry, I don't understand that choice.");
          twiml.pause();
          gather();
          break;
      }
    } else {
      gather();
    }
    res.type('text/xml');
    res.send(twiml.toString());

})

router.post("/voice", async(req,res)=>{
  const twiml = new VoiceResponse();

  const gather = twiml.gather({
    numDigits: 1,
    action:'https://call-project.cyclic.app/incomingCall/gather',
    method: 'POST'
  });

  gather.play("https://call-project.cyclic.app/Rev.mp3");
  gather.say({language: 'he-IL',voice: 'Google.he-IL-Standard-B'},'למיזם חרבות של מעשים טובים הקש 1, לתרומה הקש 2');

  twiml.redirect({
    method: 'POST'
}, 'https://call-project.cyclic.app/incomingCall/voice');

  res.type('text/xml');
  res.send(twiml.toString());
})

router.post("/gather", async(req,res)=>{
  const twiml = new VoiceResponse();
  
  if (req.body.Digits) {
    switch (req.body.Digits) {
      case '1':
        twiml.say({language: 'he-IL', voice: 'Google.he-IL-Standard-B'},'הגעת למיזם חרבות של מעשים טובים.');

          gather = twiml.gather({
          numDigits: 1,
          action:'https://call-project.cyclic.app/incomingCall/tora-magna',
          method: 'POST'
        })
        gather.say({language: 'he-IL',voice: 'Google.he-IL-Standard-B'},'אנא בחר סדר גמרא. לסדר זרעים הקש 1, לסדר מועד הקש 2, לסדר נשים הקש 3, לסדר נזיקין הקש 4, לסדר קדשים הקש 5 ');

        break;
      case '2':
        twiml.say({language: 'he-IL', voice: 'Google.he-IL-Standard-B'},'הגעת למחלקת התרומות');
        break;
      default:
        twiml.say({language: 'he-IL', voice: 'Google.he-IL-Standard-B'},"סליחה, המספר איננו מזוהה");
        twiml.pause();
        twiml.redirect({
          method: 'POST'
      }, 'https://call-project.cyclic.app/incomingCall/voice');
        break;
    }
  } else {
    twiml.redirect({
      method: 'POST'
  }, 'https://call-project.cyclic.app/incomingCall/voice');
  }

  res.type('text/xml');
  res.send(twiml.toString());
})

router.post("/tora-magna", async(req,res)=>{
  const twiml = new VoiceResponse();

  if (req.body.Digits){
    switch (req.body.Digits){
      case '1':
        twiml.say({language: 'he-IL', voice: 'Google.he-IL-Standard-B'},'הגעת לסדר זרעים');
        break
      case '2':
        twiml.say({language: 'he-IL', voice: 'Google.he-IL-Standard-B'},'הגעת לסדר מועד');
        break
      case '3':
        twiml.say({language: 'he-IL', voice: 'Google.he-IL-Standard-B'},'הגעת לסדר נשים');
        break
      case '4':
        twiml.say({language: 'he-IL', voice: 'Google.he-IL-Standard-B'},'הגעת לסדר נזיקין');
        break
      case '5':
        twiml.say({language: 'he-IL', voice: 'Google.he-IL-Standard-B'},'הגעת לסדר קדשים');
        break
      default:
        twiml.say({language: 'he-IL', voice: 'Google.he-IL-Standard-B'},"סליחה, המספר איננו מזוהה");
        twiml.pause();
        twiml.redirect({
          method: 'POST'
      }, 'https://call-project.cyclic.app/incomingCall/voice');
        break;  
    }
  }
  else{
    twiml.redirect({
      method: 'POST'
  }, 'https://call-project.cyclic.app/incomingCall/voice');
  }


  res.type('text/xml');
  res.send(twiml.toString());

})


module.exports = router;