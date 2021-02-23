const corsOptions = {
    "origin": "http://localhost:3003",
    "methods": "GET,HEAD,PUT,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
  }

module.exports = {
    corsOptions
}