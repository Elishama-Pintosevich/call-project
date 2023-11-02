const express = require("express");
const router = express.Router();
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const axios = require('axios');



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
  gather.say({language: 'he-IL',voice: 'Google.he-IL-Standard-B'},'שלום, הִגעתם למערכת הקולית של לימוד השַׁס העולמי')
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

  const masechet = [['ברכות'],['שבת','עירובין','פסחים','שקלים','יומא','סוכה','ביצה','ראש השנה','תענית','מגילה','מועד קטן','חגיגה'],['יבמות','כתובות','נדרים','נזיר','סוטַה','גיטין','קידושין'],
  ['בבא קמא','בבא מציעא','בבא בתרא','סנהדרין','מכות','שבועות','עבודה זרה','הוריות'],['זבחים','מנחות','חולין','בכורות','ערכין','תמורה','כריתות','מעילה','נידה']]

  function gether(num){
      twiml.say({language: 'he-IL', voice: 'Google.he-IL-Standard-B'},'אנא הַמְתֶן כמה רגעים')
      gather = twiml.gather({
      numDigits: 1,
      action:`https://call-project.cyclic.app/incomingCall/seder/${num-1}`,
      method: 'POST'
    })
    masechet[num-1].forEach((ele, i)=>{
      gather.say({language: 'he-IL', voice: 'Google.he-IL-Standard-B'}, `למסכת ${ele}`);
      gather.say({language: 'he-IL', voice: 'Google.he-IL-Standard-B'}, `הַקֶש ${i+1}`);
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
router.post("/seder/:id", async(req,res)=>{
  const twiml = new VoiceResponse();
// https://good-action.cyclic.app/tractates/single
// https://good-action.cyclic.app/tractates/setPages
  const masechet = [['ברכות'],['שבת','עירובין','פסחים','שקלים','יומא','סוכה','ביצה','ראש השנה','תענית','מגילה','מועד קטן','חגיגה'],['יבמות','כתובות','נדרים','נזיר','סוטַה','גיטין','קידושין'],
  ['בבא קמא','בבא מציעא','בבא בתרא','סנהדרין','מכות','שבועות','עבודה זרה','הוריות'],['זבחים','מנחות','חולין','בכורות','ערכין','תמורה','כריתות','מעילה','נידה']]
  const id = [["65291f2664f26cd4f42bf2bc"],["65291fd664f26cd4f42bf2c2","6529202764f26cd4f42bf2c4","6529207764f26cd4f42bf2c8","652921b064f26cd4f42bf2ca","6529220464f26cd4f42bf2cc","6529224364f26cd4f42bf2ce",
  "652922ba64f26cd4f42bf2d0","652922f764f26cd4f42bf2d2","6529235164f26cd4f42bf2d4","652923cb64f26cd4f42bf2d6","6529241064f26cd4f42bf2d8","6529244364f26cd4f42bf2da"],
  ["6529248864f26cd4f42bf2dc","652924c164f26cd4f42bf2de","652924fb64f26cd4f42bf2e0","6529252564f26cd4f42bf2e2","652927db64f26cd4f42bf2e4","6529281d64f26cd4f42bf2e6",
  "6529284b64f26cd4f42bf2e8"],["652928b164f26cd4f42bf2ea","65292a0564f26cd4f42bf2ec","65292a8664f26cd4f42bf2f0","65292b0264f26cd4f42bf2f2","65292b9f64f26cd4f42bf2f4",
  "65292bd864f26cd4f42bf2f6","65292c8864f26cd4f42bf2f8","65292cba64f26cd4f42bf2fa"],["65292cf364f26cd4f42bf2fc","65292d1564f26cd4f42bf2fe","65292d3c64f26cd4f42bf300",
  "65292d5964f26cd4f42bf302","65292dc064f26cd4f42bf306","65292dec64f26cd4f42bf308","65292e2764f26cd4f42bf30a","65292e7364f26cd4f42bf30c","65292e9b64f26cd4f42bf30e"]]
   
  function gether(){
    let idMasechet = id[req.params.id][req.body.Digits-1]
      gather = twiml.gather({
      finishOnKey: "#",
      action:`https://call-project.cyclic.app/incomingCall/masechet/${idMasechet}`,
      method: 'POST'
    })
    gather.say({language: 'he-IL', voice: 'Google.he-IL-Standard-B'}, `אנא בחר דף באמצעות מספר ואחריו הקש סולמית. לדוגמה לדף בט הקש 2 ואחריו הקש סולמית.`);

  }

  if(req.body.Digits && req.body.Digits <= masechet[req.params.id].length){
    const item = masechet[req.params.id][req.body.Digits-1]
    twiml.say({language: 'he-IL', voice: 'Google.he-IL-Standard-B'},` נבחרה מסכת ${item}`)
    gether()
  }
  else{
    twiml.say({language: 'he-IL', voice: 'Google.he-IL-Standard-B'},"סליחה, המספר איננו מזוהה");
    twiml.pause();
    twiml.redirect({
      method: 'POST'
  }, 'https://call-project.cyclic.app/incomingCall/voice');
  }
  res.type('text/xml');
  res.send(twiml.toString());
})
// מה שבעצם צריך לעשות אחרי שנבחרה המסכת ואנחנו יודעים את האיידי שלה זה להעביר לראוט הבא עם בקשה של הקש דף ואחכ סולמית אז מה שבעצם יקרה יעבור לראוט הבא האיידי של המסכת ביואראל ומספר הדף ואחרי שיש לנו את זה תהיה בקשה לשרת בסינגל ולבדוק את כמות הדפים ואם המספר תואם את מה שקיים אם כן צריך לבדוק את המערך במיקום של המספר של המשמש אם זה תפוס אם כן אז להעביר אותו להתחלה אם לא תפוס אז לעדכן את השרת ולהגיד תודה רבה על הבחירה



//global storage
let data = 0
//
router.post("/masechet/:id", async(req,res)=>{
  let id = req.params.id
  let urlGet = `https://good-action.cyclic.app/tractates/single/${id}`
  const twiml = new VoiceResponse();

  function gether(){
      gather = twiml.gather({
      numDigits: 1,
      action:`https://call-project.cyclic.app/incomingCall/amud/${req.body.Digits}`,
      method: 'POST'
    })
    gather.say({language: 'he-IL', voice: 'Google.he-IL-Standard-B'}, `אנא בחר עמוד. לעמוד אָלֶף הקש 1, לעמוד בֶט הקש 2.`);

  }
  
  data = await axios.get(urlGet).then((response) => response.data);
  digit = req.body.Digits || 0
  if(digit && digit <= data[0].count/2+1 && digit >= 2){
    twiml.say({language: 'he-IL', voice: 'Google.he-IL-Standard-B'},` נבחר דף ${req.body.Digits}`)
    gether()
  }
  else{
    twiml.say({language: 'he-IL', voice: 'Google.he-IL-Standard-B'},"סליחה, המספר איננו מזוהה");
    twiml.pause();
    twiml.redirect({
      method: 'POST'
  }, 'https://call-project.cyclic.app/incomingCall/voice');
  }
  res.type('text/xml');
  res.send(twiml.toString());
})
// בעצם מה שצריך לעשות עכשיו זה לשאול את המשתמש איזה עמוד הוא בוחר עמוד אלף או עמוד ב ואם הוא נניח מקיש 2 אז המערכת תבדוק בגלובל סטורג האם המערך במיקום ההוא תפוס או לא 
router.post("/amud/:id", async(req,res)=>{
  const twiml = new VoiceResponse();
  let urlEdit = `https://good-action.cyclic.app/tractates/setPages/${data[0]._id}`
  const id = req.params.id
  
  if(req.body.Digits && req.body.Digits<3){
    switch (req.body.Digits){
      case '1':
        if(data[0].pages[(id-2)*2]==1){
          twiml.say({language: 'he-IL', voice: 'Google.he-IL-Standard-B'},`העמוד תפוס, נסה עמוד או דף אחר. תודה`)
        }
        else{
          data[0].pages[(id-2)*2]=1
          const data2 = await axios.put(urlEdit,{name:data[0].name, count:data[0].count, pages:data[0].pages, amud:data[0].amud}).then((response) => response);
          console.log(data2);
          twiml.say({language: 'he-IL', voice: 'Google.he-IL-Standard-B'},`מעולה, הדף נתפס בהצלחה. תודה`)
        }
        break
      case '2':
          if(data[0].pages[(id-2)*2+1]==1){
          twiml.say({language: 'he-IL', voice: 'Google.he-IL-Standard-B'},`העמוד תפוס, נסה עמוד או דף אחר. תודה`)
        }
        else{
          data[0].pages[(id-2)*2+1]=1
          const data2 = await axios.put(urlEdit,{name:data[0].name, count:data[0].count, pages:data[0].pages, amud:data[0].amud}).then((response) => response);
          console.log(data2);
          twiml.say({language: 'he-IL', voice: 'Google.he-IL-Standard-B'},`מעולה, הדף נתפס בהצלחה. תודה`)
        }
        break
    }
  }
  else{
    twiml.say({language: 'he-IL', voice: 'Google.he-IL-Standard-B'},"סליחה, המספר איננו מזוהה");
    twiml.pause();
    twiml.redirect({
      method: 'POST'
  }, 'https://call-project.cyclic.app/incomingCall/voice');
  }
  res.type('text/xml');
  res.send(twiml.toString());
})


module.exports = router;