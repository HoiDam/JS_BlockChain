let mongoose = require("mongoose")

let BlockChainModel = require("./model");

let connectionCallback = () => {};
let doc_code = "A"

//Connect to DB
url = "mongodb://localhost:27017/BlockChain_" + doc_code
console.log(url)
mongoose.connect(url, (err) => {
    if(err) 
        return console.log("Cannot connect to DB");
    console.log("Database is Connected");
    connectionCallback();
});

module.exports.onConnect = (callback,number) => {
    doc_code = number
    connectionCallback = callback;
}

