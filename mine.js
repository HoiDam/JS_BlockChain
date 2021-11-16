let database = require("./src/database");
database.connect("a")
database.onConnect(()  => {

    let BlockChain = require("./src/blockChain")

    let blockChain = new BlockChain();

    let hash = require('object-hash');

    let PROOF = 1560;

    let validProof = (proof) => {
        let guessHash = hash(proof);
        console.log("Hashing: ", guessHash);
        return guessHash == hash(PROOF);
    };

    let proofOfWork = () => {
        let proof = 0;
        while (true) {
            if (!validProof(proof)){
                proof++;
            } else {
                break;
            }
        }
    }

    if (proofOfWork() == PROOF) {
        blockChain.addNewTransaction("islem", "alex", 200);
        let prevHash = blockChain.lastBock() ?
            blockChain
            .lastBock()
            .hash :
            null;
        blockChain.addNewBlock(prevHash);    
    }

    blockChain.addNewTransaction("islem", "alex", 200);
    blockChain.addNewBlock(null);



console.log("Chain : ", blockChain.chain);

})