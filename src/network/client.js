const fetch = require('node-fetch-commonjs');

module.exports.getChain = async(targetPort,doc_code)=>{
    let url = "http://localhost:"+(targetPort).toString()+"/getBlock"
    await fetch(url)
    .then((res)=>{
        return res.json()
    })
    .then((docArray)=>{
        // console.log(docArray)
        if (docArray != null){
            let database = require("../database");
            database.onConnect(() => {
                let BlockChain = require("../blockChain")
                let blockChain = new BlockChain()
                blockChain.replaceContent(docArray)
            },doc_code)
            console.log("Get Block Done!")
        }else{
            console.error("Cant get from ",targetPort)
        }
    })
    .catch((e)=>{return null})
    

}

module.exports.postChain = (targetPort,doc_code)=>{
    let database = require("../database");
    var port = 3000
    database.onConnect(async()  => {
        let BlockChain = require("../blockChain")
        let blockChain = new BlockChain();
        chains = await blockChain.getChain() //return chain
        // console.log(chains)
        
        for (let i=0;i<10;i++)
            {
                if (targetPort != port+i){ //prevent selfposting
                    url = "http://localhost:"+(port+i).toString()+"/postChain"
                    try{
                        fetch(url, {
                            method: 'post',
                            headers: {
                                'Accept': 'application/json, text/plain, */*',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(chains)
                        }).catch(()=>{})
                    }
                    catch(e){
                        break
                    }
                }
                
            }
        },doc_code)
    


}

module.exports.transact = async(doc_code,req_doc_code)=>{
    let database = require("../database");
    var hash = require("crypto-js/sha256");

    database.onConnect(async()  => {
        let BlockChain = require("../blockChain")
        let blockChain = new BlockChain();
        chains = await blockChain.getChain() //return chain

        let target = null
        for (let block in chains){
            let sum_value = 0
            for (let trans in chains[block]["transactions"]){
                if (chains[block]["transactions"][trans]["recipient"] == hash(doc_code).toString()){
                    sum_value += chains[block]["transactions"][trans]["amount"]
                }
                if (chains[block]["transactions"][trans]["sender"] == hash(doc_code).toString()){
                    sum_value -= chains[block]["transactions"][trans]["amount"]
                }
            }
            // console.log(sum_value)
            if (sum_value>1){
                let prevHash = chains[block]["transactions"].slice(-1)[0]["transaction_id"]
                let sender = hash(doc_code).toString()
                let recipient = hash(req_doc_code).toString()
                let amount = 1 // send one money 
                let transaction_id = hash(prevHash+sender+recipient+amount.toString()).toString()
                chains[block]["transactions"].push({ prevHash,transaction_id,sender, recipient, amount });
                target = true
                // console.log(chains[block]["transactions"])
                break
            }
        }
        

        if (target != null){
            blockChain.replaceContent(chains)
            console.log("Transact Successful")
        }else{
            console.error("You dont have enough coins!")
        }
    },doc_code)

    return new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, 2000);
      });
}