const express = require('express')
const axios = require('axios')

var port = 3000
for (let i=0;i<10;i++)
{
    flag = false
    response = axios.get("http://localhost:"+(port).toString())
        .then(function (response) {
            return response
        })
    console.log(response.data)
    if (response.data  == null){
        flag = true
    }
    if (flag == true){
        break
    }else{
        port +=1
    }
    
}

const app = express()

app.get('/', (req, res) => {
  res.send('Success')
})

app.get('/chain',(req,res)=>{
    
    let database = require("./src/database");
    database.connect("a")
    database.onConnect(() => {
        let BlockChain = require("./src/blockChain")
        let blockChain = new BlockChain()
        console.log(blockChain.getChain())
        res.send("chain")
    })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
