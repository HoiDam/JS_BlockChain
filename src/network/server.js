const express = require('express')
const fetch = require('node-fetch-commonjs');

const defaultPort = 3000
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
    const doc_code = String.fromCharCode("A".charCodeAt(0) + port-defaultPort);

    app.use(express.json());

    app.get('/', (req, res) => {
        res.send('Success')
    })

    app.post('/postChain',(req,res)=>{
        let docArray = req.body
        let database = require("../database");
        database.onConnect(() => {
            let BlockChain = require("../blockChain")
            let blockChain = new BlockChain()
            blockChain.replaceContent(docArray)
        },doc_code)
        res.send(null)
    })

    app.listen(port, () => {
    // console.log(`Server listening at http://localhost:${port}`)
    })

    return new Promise(resolve => {
        setTimeout(() => {
          resolve({port,doc_code});
        }, 2000);
      });
    
}

module.exports.runServer = runServer
