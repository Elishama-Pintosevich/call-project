const indexR = require("./index");
const incomingCallR = require("./incomingCall")

exports.routesInit = (app) => {
  app.use("/", indexR);
  app.use("/incomingCall", incomingCallR)

}