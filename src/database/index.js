let mongoose = require("mongoose")

let connectionCallback = () => {};
let doc_code

function connectDB() {
    //Connect to DB
    url = "mongodb://localhost:27017/BlockChain_" + doc_code
    // console.log(url)
    mongoose.connect(url, (err) => {
        if(err) 
            return console.log("Cannot connect to DB");
        // console.log("Database is Connected"); //to be uncomment
        connectionCallback();
    });
}


module.exports.onConnect = (callback,number) => {
    doc_code = number
    connectionCallback = callback;
    connectDB()
}

