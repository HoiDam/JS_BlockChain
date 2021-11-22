let mongoose = require("mongoose");
let blockChainSchema = require("./database/model").schema
let blockChainModel 
let chalk = require("chalk");


class BlockChain {
    constructor() {
      this.chain = [];
      this.transactions = [];
      blockChainModel = mongoose.model("blocks",blockChainSchema);
    }

    async getChain(){
      let chains = await blockChainModel.find()
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(chains);
        }, 2000);
      });
    }

    async getLastBlock() {
          return blockChainModel.findOne({}, null, { sort: { _id: -1}, limit: 1 })
    }
      
  
    addNewBlock(block) {
      block.transactions = this.transactions
      let newBlock = new blockChainModel(block);
      // console.error(newBlock)
      newBlock.save((err) => {
        if (err)
          return console.log(chalk.red("Cannot save the Block to DB ", err.message));
        console.log(chalk.green("Block Saved on the DB"));
      });
      this
        .chain 
        .push(block);
      this.transactions = [];
      return block;

    }

    addNewTransaction(sender, recipient, amount) {
      const {createHash} = require('crypto');
      function hash(string){
        return createHash('sha256').update(string).digest('hex');
      }
      let transaction_id = hash(sender+recipient+amount.toString())
      this
        .transactions
        .push({ transaction_id,sender, recipient, amount });
    }

    lastBock() {
      return this
      .chain.slice(-1)[0];
    }

    isEmpty() {
      return this.chain.length == 0;
    }
    
    async replaceContent(docArray){
      for (const doc in docArray ){
        // console.log(docArray[doc]["_id"])
        let id = docArray[doc]["_id"]
        delete docArray[doc]["_id"]
        await blockChainModel.findOneAndUpdate({ _id: id },
          docArray[doc],
          { upsert: true });
      }
    }
}

module.exports = BlockChain;

