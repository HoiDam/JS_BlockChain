const express = require('express')
const fetch = require('node-fetch-commonjs');

var port = 3000
async function checkPort(){
    for (let i=0;i<10;i++)
    {
        url = "http://localhost:"+(port).toString()+"/"
        
            response = await fetch(url)
            .then((resp)=>{return resp})
            .catch((e)=>{return e})
            
            if (response.status !=200){
                break
            }
            // console.log(response.status)
        port +=1
    }
}

async function runServer(){

    await checkPort()
    const app = express()

    app.get('/', (req, res) => {
        res.send('Success')
    })

    app.get('/chain',(req,res)=>{
        
        let database = require("../database");
        database.connect("a")
        database.onConnect(() => {
            let BlockChain = require("../blockChain")
            let blockChain = new BlockChain()
            console.log(blockChain.getChain())
            res.send("chain")
        })
    })

    app.listen(port, () => {
    // console.log(`Server listening at http://localhost:${port}`)
    })

    return new Promise(resolve => {
        setTimeout(() => {
          resolve(port);
        }, 2000);
      });
    
}

module.exports.runServer = runServer
