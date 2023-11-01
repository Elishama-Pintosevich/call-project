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

  // gather.play("https://call-project.cyclic.app/Rev.mp3");
  gather.say({language: 'he-IL',voice: 'Google.he-IL-Standard-B'},'שלום, הִגעתם למערכת הקולית של לימוד השַס העולמי')
  gather.say({language: 'he-IL',voice: 'Google.he-IL-Standard-B'},'למיזם חרבות של מעשים טובים הקֶש 1, לתרומה הקֶש 2');

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
        twiml.say({language: 'he-IL', voice: 'Google.he-IL-Standard-B'},'הִגעת למיזם חרבות של מעשים טובים.');

          gather = twiml.gather({
          numDigits: 1,
          action:'https://call-project.cyclic.app/incomingCall/tora-magna',
          method: 'POST'
        })
        gather.say({language: 'he-IL',voice: 'Google.he-IL-Standard-B'},'אנא בחר סדר גמרא. לסדר זרעים הקֶש 1, לסדר מועד הקֶש 2, לסדר נשים הקֶש 3, לסדר נזיקין הקֶש 4, לסדר קָדשים הקֶש 5 ');

        break;
      case '2':
        twiml.say({language: 'he-IL', voice: 'Google.he-IL-Standard-B'},'הִגעת למחלקת התרומות');
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

  const masechet = [['ברכות'],['שבת','עירובין','פסחים','שקלים','יומא','סוכה','ביצה','ראש השנה','תענית','מגילה','מועד קטן','חגיגה'],['יבמות','כתובות','נדרים','נזיר','סוטה','גיטין','קידושין'],
  ['בבא קמא','בבא מציעא','בבא בתרא','סנהדרין','מכות','שבועות','עבודה זרה','הוריות'],['זבחים','מנחות','חולין','בכורות','ערכין','תמורה','כריתות','מעילה','נידה']]

  function gether(num){
      gather = twiml.gather({
      numDigits: 1,
      action:'https://call-project.cyclic.app/incomingCall/seder',
      method: 'POST'
    })
    masechet[num-1].forEach((ele, i)=>{
      gather.say({language: 'he-IL', voice: 'Google.he-IL-Standard-B'}, `למסכת ${ele}`);
      gather.say({language: 'he-IL', voice: 'Google.he-IL-Standard-B'}, `הקֶש ${i+1}`);
    })
  }

  if (req.body.Digits){
    switch (req.body.Digits){
      case '1':
        twiml.say({language: 'he-IL', voice: 'Google.he-IL-Standard-B'},'הִגעת לסדר זרעים');
        gether(1)
        break
      case '2':
        twiml.say({language: 'he-IL', voice: 'Google.he-IL-Standard-B'},'הִגעת לסדר מועד');
        gether(2)
        break
      case '3':
        twiml.say({language: 'he-IL', voice: 'Google.he-IL-Standard-B'},'הִגעת לסדר נשים');
        gether(3)
        break
      case '4':
        twiml.say({language: 'he-IL', voice: 'Google.he-IL-Standard-B'},'הִגעת לסדר נזיקין');
        gether(4)
        break
      case '5':
        twiml.say({language: 'he-IL', voice: 'Google.he-IL-Standard-B'},'הִגעת לסדר קדשים');
        gether(5)
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
// בעצם מה שצריך לעשות זה אחרי שבוחרים איזה סדר צריך לבחור איזו מסכת אחרי שבן אדם נניח לחץ על מועד אז צריך להיכנס לגטר של 12 מסכתות לפחות איך אפשר לעשות את זה דינמי לעשות מערך ל מערכים ולקחת לפי מיקום ולעשות דיבור לולאה של דיבור עם מיקום ואם בן אדם לוחץ מספר יותר גדול מהאורך אז זה מחזיר אותו חזרה אם לא זה עושה לו רידיירט לכתובת לפי ההאאיד שהוא בחר
router.post("/seder", async(req,res)=>{
  const twiml = new VoiceResponse();
   
  if(req.body.Digits){
    twiml.say({language: 'he-IL', voice: 'Google.he-IL-Standard-B'},"תודה ולהתראות")
  }
  else{
    twiml.redirect({
      method: 'POST'
  }, 'https://call-project.cyclic.app/incomingCall/voice');
  }

})


module.exports = router;