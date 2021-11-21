async function transaction(sender, recipient, amount) {
    let database = require("./src/database");

    database.onConnect(async() =>{
    
    let BlockChain = require("./blockchain")

    let blockChain = new BlockChain();

    if(!sender || !recipient){
      throw new Error('Sender and recipient address must all be included in the transaction');
    }

    if(amount<=0 || isNaN(amount) == true ){
      throw new Error('The transaction amount should be larger than 0 and is a number')
    }

    let balance = 0;

    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.sender === address) {
          balance -= trans.amount;
        }

        if (trans.recipient === address) {
          balance += trans.amount;
        }
      }
    }
    
    if(balance < amount){
      throw new Error('The balance is insufficient');
    }

    blockChain.addNewTransaction(sender, recipient, amount);

    console.log("Transaction completed!")
    console.log("Block : ", blockChain.transaction);

    })
}


module.exports.transactions = transaction