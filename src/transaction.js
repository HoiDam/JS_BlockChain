const {createHash} = require('crypto');

function hash(string){
  return createHash('sha256').update(string).digest('hex');
}

async function transaction(doc_code,sender,recipient,amount) {
    let database = require("./database");


    database.onConnect(async() =>{
    
      let BlockChain = require("./blockChain")

      let blockChain = new BlockChain();

    if(amount<=0){
      throw new Error('The transaction amount should be larger than 0 and is a number')
    }

    value_to_hash = sender + recipient + amount;
    transaction_id = hash(value_to_hash);

    blockChain.addNewTransaction(sender, recipient, amount, transaction_id);

    console.log("Transaction completed!")
    console.log("Transaction : ", blockChain.transactions);

    },doc_code)
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });
}


module.exports.transaction = transaction