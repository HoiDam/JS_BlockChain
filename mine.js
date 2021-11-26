async function mining(doc_code){
    let database = require("./src/database");

    database.onConnect(async()  => {
        let BlockChain = require("./src/blockChain")
        let blockChain = new BlockChain();

        var hash = require("crypto-js/sha256");
        let PROOF = Math.floor(Math.random() * (Math.pow(10,8) - Math.pow(10,4))) + Math.pow(10,4);
        let diff = Math.floor(Math.random() * (4-3)+3)
        PROOF = hash(PROOF).toString()
        for (let i = 0; i<diff;i+=1){
            PROOF = PROOF.substring(0, i) + '0' + PROOF.substring(i + 1);
        }

        let prevBlock = await blockChain.getLastBlock()
        var block = {
            index: 0,
            transactions: null,
            timestamp: Math.floor(Date.now()),
            prevHash: null,
            difficulty: PROOF,
            nonce: 0,
            hash:null
        };
        
        if(prevBlock != null) {
            block.prevHash = prevBlock.hash;
            block.index = prevBlock.index +1
        }

        var guessHash = ""
        let validProof = (block) => {
            guessHash = ""
            for (var key in block){
                if (block[key] != null){
                    guessHash += block[key].toString()
                }
            }
            guessHash = hash(guessHash).toString()
            console.log("Hashing: ", guessHash); //Uncomment it
            return guessHash < block.difficulty;
        };
    
        let proofOfWork = () => {
            while (true) {
                if (!validProof(block)){
                    block.nonce = block.nonce+1;
                } else {
                    
                    break;
                }
            }
        }
        proofOfWork()   
        block.hash = guessHash
        blockChain.addNewTransaction("", hash(doc_code).toString(), Math.floor(Math.random() * (5000 - 10) + 10));
        blockChain.addNewBlock(block);    
    
        console.log("Chain : ", blockChain.chain); //Uncomment it
        
    },doc_code)
    return new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, 2000);
      });
    
    
}

module.exports.mining = mining