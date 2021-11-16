let mongoose = require("mongoose")

let BlockChainModel = require("./model");

let connectionCallback = () => {};
module.exports.connect = (number)=>{
    //Connect to DB
    
    url = "mongodb://localhost:27017/BlockChain_" + number
    console.log(url)
    mongoose.connect(url, (err) => {
        if(err) 
            return console.log("Cannot connect to DB");
        console.log("Database is Connected");
        connectionCallback();
    });
}

module.exports.onConnect = (callback) => {
    connectionCallback = callback;
}