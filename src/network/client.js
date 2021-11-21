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
            console.log("Get Block Done !")
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