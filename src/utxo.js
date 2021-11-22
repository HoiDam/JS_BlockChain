async function getAllTransactionsForWallet(address){
    let database = require("./src/database");
    const txs = [];

    database.onConnect(async()=> {
        let record = () =>{
        for (const block of this.chain) {
            for (const tx of block.transactions) {
              if (tx.sender === address || tx.recipient === address) {
                txs.push(tx);
              }
            }
          }
        }
          return txs;
    })
    
  }

  module.exports.getAllTransactionsForWallet = getAllTransactionsForWallet