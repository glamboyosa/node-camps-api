const winston = require("winston");
// require("winston-mongodb");
module.exports = function() {
  process.on("uncaughtException", ex => {
    winston.error(ex.message, ex);
    winston.transports.Console({ colorize: true, prettyPrint: true });
    process.exit(1);
  });
  process.on("unhandledRejection", ex => {
    console.log("An unhandled rejection was caught");
    winston.error(ex.message, ex);
    process.exit(1);
  });
  winston.add(winston.transports.File, { filename: "logfile.log" });
  // winston.add(winston.transports.MongoDB, {
  //   db: "mongodb://localhost/camps"
  // });
};
