if (process.env.NODE_ENV == "production") {

    module.exports = {mongoURI: "mongodb://mongo:WFZsT9K2BqFPpVAD0eiR@containers-us-west-52.railway.app:7297"}

} else {

    module.exports = {mongoURI: "mongodb://localhost:27017/TCC"}

}
