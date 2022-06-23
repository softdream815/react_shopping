const winston = require('winston');
const settings = require('./settings');
const LOGS_FILE = 'logs/server.log';

winston.configure({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({
      filename: LOGS_FILE,
      handleExceptions: true
    })
  ]
});

const getResponse = message => {
  return {
    'error': true,
    'message': message
  };
}

const logUnauthorizedRequests = req => {
  // todo
}

const sendResponse = (err, req, res, next) => {
  if(err && err.name === 'UnauthorizedError') {
    logUnauthorizedRequests(req);
    res.status(401).send(getResponse(err.message.toString()));
  } else if(err) {
    winston.error('API error', err);
    res.status(500).send(getResponse(err.toString()));
  } else {
    next();
  }
}

module.exports = {
  sendResponse: sendResponse
}
