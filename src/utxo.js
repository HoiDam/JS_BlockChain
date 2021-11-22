let mongoose = require("mongoose");
let utxoSchema = require("./database/model").utxoSchema
let utxoShcemaModel

class UTXO {
  constructor(){
    this.transactions = [];
    utxoShcemaModel = mongoose.model("utxos",utxoSchema)
  }
  async replaceContent(docArray){
    for (const doc in docArray ){
      // console.log(docArray[doc]["_id"])
      let transaction_id = docArray[doc]["transaction_id"]
      delete docArray[doc]["transaction_id"]
      await utxoShcemaModel.findOneAndUpdate({ transaction_id: transaction_id },
        docArray[doc],
        { upsert: true });
    }
  }
}

async function utxo_list(doc_code){

  let database = require("./database");
  database.onConnect(async()  => {
      let BlockChain = require("./blockChain")
      let blockChain = new BlockChain();
      chains = await blockChain.getChain() //return chain
      transactions = []
      for (let key in chains){
        for (let trans in chains[key]["transactions"]){
          transactions.push(chains[key]["transactions"][trans])
        }
      }

      console.log(transactions)
      console.log("End of Transaction Record.")

      let utxo = new UTXO()
      await utxo.replaceContent(transactions)
      console.log("Saved in database")
      
  },doc_code)
}
module.exports.utxo_list = utxo_list