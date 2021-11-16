let hash = require('object-hash');
const TARGET_HASH = hash(1560);
let validator = require("./validator");
let mongoose = require("mongoose");
let blockChainModel = mongoose.model("BlockChain");
let chalk = require("chalk");


class BlockChain {
    constructor() {
      this.chain = [];
      this.curr_transactions = [];
    }

    getChain(){
      return blockChainModel.find()
    }

    getLastBlock(callback) {
          return blockChainModel.findOne({}, null, { sort: { _id: -1}, limit: 1 }, (err, block) => {
          
            if(err) 
              return console.error("Cannot find Last Block");
            return callback(block)
          })
        }

    addNewBlock(prevHash) {
      let block = {
        index: null,
        timestamp: Date.now(),
        transactions: this.curr_transactions,
        prevHash: prevHash
      };

      if (validator.proofOfWork() == TARGET_HASH) {
        block.hash = hash(block);

        let lastBlock = null;
        this.getLastBlock((lastBlock) => {
          // console.error(lastBlock)
          if(lastBlock) {
            block.prevHash = lastBlock.hash;
            block.index = lastBlock.index +1
          }else{
            block.prevHash = null;
            block.index = 0
          }
          let newBlock = new blockChainModel(block);
          console.error(newBlock)
          newBlock.save((err) => {
            if (err)
              return console.log(chalk.red("Cannot save the Block to DB ", err.message));
            console.log(chalk.green("Block Saved on the DB"));
          });
          this
            .chain 
            .push(block);
          this.curr_transactions = [];
          return block;
        });

      }
    }

    addNewTransaction(sender, recipient, amount) {
      this
        .curr_transactions
        .push({ sender, recipient, amount });
    }

    lastBock() {
      return this
      .chain.slice(-1)[0];
    }

    isEmpty() {
      return this.chain.length == 0;
    }
}

module.exports = BlockChain;
