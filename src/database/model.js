let mongoose = require("mongoose");
let Schema = mongoose.Schema;


//Create the BlockChain Schema
let BlockChainSchema = new Schema({

    index: {
        required: true,
        type: Schema.Types.Number
    },
    timestamp: {
        required: true,
        type: Schema.Types.Number
    },
    transactions: {
        required: true,
        type: Schema.Types.Array,
    },
    prevHash: {
        required: false,
        type: Schema.Types.String,
    },
    hash: {
        required: true,
        type: Schema.Types.String
    },
    difficulty:{
        required: true,
        type: Schema.Types.Number
    },
    nonce:{
        required: true,
        type: Schema.Types.Number
    }
});


module.exports.schema = BlockChainSchema