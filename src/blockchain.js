let hash = require('object-hash');
const TARGET_HASH = hash(1560);
let validator = require("./validator");
let mongoose = require("mongoose");
let blockChainSchema = require("./database/model").schema
let blockChainModel 
let chalk = require("chalk");

// class Block {

//   constructor(timestamp, transactions, previousHash = '') {
//     this.previousHash = previousHash;
//     this.timestamp = timestamp;
//     this.transactions = transactions;
//     this.nonce = 0;
//     this.hash = 0;
//   }

//   async getBlock(){
//     let block = await blockChainModel.find()
//     return new Promise(resolve => {
//       setTimeout(() => {
//         resolve(chains);
//       }, 2000);
//     });

//   }
// }

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


    getLastBlock(callback) {
          return blockChainModel.findOne({}, null, { sort: { _id: -1}, limit: 1 }, (err, block) => {
          
            if(err) 
              return console.error("Cannot find Last Block");
            return callback(block)
          })
        }

    getDifficulty() {
      const latestBlock = this.getLatestBlock();
      if (
        latestBlock.index % DIFFICULTY_ADJUSTMENT_INTERVAL === 0 &&
        latestBlock.index !== 0
      ) {
        return getAdjustedDifficulty(latestBlock, this.blockchain);
      } else {
        return latestBlock.difficulty;
      }
    }
    addNewBlock(prevHash) {
      let block = {
        index: null,
        timestamp: Date.now(),
        transactions: this.transactions,
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
          this.transactions = [];
          return block;
        });

      }
    }

    addNewTransaction(sender, recipient, amount,transaction_id) {
      
      let transaction = {
        sender: sender,
        recipient: recipient,
        amount: amount, 
        transaction_id: transaction_id
      };
      this
      .transactions
      .push(transaction);
      return transaction;
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

class Block{
  constructor(timestamp, transaction, prevHash = ''){
    this.prevHash = prevHash;
    this.timestamp = timestamp;
    this.transaction = transaction;
    this.nonce = 0;
    this.hash = 0;
  }

  getBalanceOfAddress(address) {
    let balance = 0;

      for (const trans of Block.transaction) {
        if (trans.sender === address) {
          balance -= trans.amount;
        }

        if (trans.recipient === address) {
          balance += trans.amount;
        }
      }

    debug('getBalanceOfAdrees: %s', balance);
    return balance;
  }
  
}

module.exports = BlockChain;
