let hash = require('object-hash');
const TARGET_HASH = hash(1560);
let validator = require("./validator");
let mongoose = require("mongoose");
let blockChainSchema = require("./database/model").schema
let blockChainModel 
let chalk = require("chalk");

class BlockChain {
    constructor() {
      this.chain = [];
      this.curr_transactions = [];
      this.difficulty = 10;
      this.nonce = Math.random();
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

    /** Adding a new Block to current Block */
    addNewBlock(prevHash) {
      let block = {
        index: null,
        timestamp: Date.now(),
        transactions: this.curr_transactions,
        prevHash: prevHash
      };
     
      /**Validating the result of PoW calculation */
      if (validator.proofOfWork() == TARGET_HASH) {
        block.hash = hash(block);

      /** Getting info from the latest block */
      /** Use it to the get the hash of previous block */
        let lastBlock = null;
        this.getLastBlock((lastBlock) => {
          // console.error(lastBlock)
          if(lastBlock) {
            block.prevHash = lastBlock.hash;
            block.index = lastBlock.index +1
          }else{
          /** In case there is no previous block */
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
          this.chain.push(block);
          this.curr_transactions = [];
          return block;
        });

      }
    }

    /** Record a new Transaction */
    addNewTransaction(sender, recipient, amount) {
      if(!sender || !recipient){
        throw new Error('Sender and recipient address must all be included in the transaction');
      }

      if(!this.is_transaction_valid()){
        throw new Error('The invalid transaction cannot be added to the chain')
      }

      if(amount<=0){
        throw new Error('The transaction amount should be larger than 0')
      }

      if(this.get_the_balance(transactions.address) < transaction.amount){
        throw new Error('The balance is insufficient');
      }

      this.curr_transactions.push({ sender, recipient, amount });
    }

    get_the_balance(address){
      let balance = 0;

      for(const blk of this.chain){
        for(const trans of block.transactions){
          if(trans.sender == address){
            balance -= trans.amount;
          }

          if(trans.recipient == address){
            balance += trans.amount;
          }
        }
      }

      return balance;
    }
    lastBlock() {
      return this.chain.slice(-1)[0];
    }

    /** To check whether the blockchain is empty */
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

    /** Calculate the hash of single transaction */
    hash_calculation(){
      return SHA256(this.sender + this.recipient + this.amount).toString();
    }

    /** Signing the transaction with public key generated to the node */
    sign_transaction(signing_key){
      if(signing_key.getPublic('hex')!== this.sender){
          throw new Error('Your public key is invalid');
      }

      const hash_hash = this.hash_calculation();
      const sig = signing_key.sign(hash_hash,'base64');
      this.signature = sig.toDER('hex');
    }

    /** Validating transaction with node's signature */
    is_transaction_valid(){
      for(const k of this.transactions){
        if(!k.valid_or_not()){
          return false;
        }
      }
      return true;
    }

    valid_or_not(){
      if(this.sender === null) return true;

      if(!this.signature || this.signature.length === 0){
        throw new Error('The signature of this transaction is N/A');
      }
      const public_key = ec.keyFromPublic(this.sender, 'hex')
      return public_key.verify(this.calculateHash(), this.signature);
    }

    /** Get all the transaction records from the input address */
    /** Maybe as another option for node */
    get_all_transaction(address){
      const k = [];
      
      for(const blk of this.chain){
        for(const q of blk.transaction){
          if(q.sender === address || q.recipient === address){
            k.push(q);
          }
        }
      }
      return k;
    }

    /** To verify the validity of the chain */
    is_this_chain_valid(){
      for(let i = 1; i< this.chain.length; i++){
          const curr_block = this.chain[i];
          const prev_block = this.chain[i-1];
      }
  
      /** Comparing the hash from previous hash and the same parameter stored in current block */
      if(prev_block.hash !== curr_block.prev_block){
          return false;
      }
  
      /** Verifying the integrity of the hash of current block */
      if(!curr_block.hash !== curr_block.calculateHash()){
          return false;
      }
  }

module.exports = BlockChain;
