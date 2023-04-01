if (process.env.NODE_ENV == "production") {

    module.exports = {mongoURI: "mongodb://mongo:InZx7piilfoDRxyG2Goh@containers-us-west-71.railway.app:7575"}

} else {

    module.exports = {mongoURI: "mongodb://localhost:27017/TCC"}

}
