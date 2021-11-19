const fetch = require('node-fetch-commonjs');


module.exports.postChain = (portOri,doc_code)=>{
    let database = require("../database");
    var port = 3000
    database.onConnect(async()  => {
        let BlockChain = require("../blockChain")
        let blockChain = new BlockChain();
        chains = await blockChain.getChain() //return chain
        // console.log(chains)
        
        for (let i=0;i<10;i++)
            {
                if (portOri != port+i){ //prevent selfposting
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
                        // console.log(response.status)
                }
                
            }
        },doc_code)
    


}