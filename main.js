const server = require("./src/network/server")
let chalk = require("chalk");

var recursiveAsyncReadLine = async function (readline,port,doc_code) {
  readline.question(
    `------\nWhat operation you would like to conduct?\n1. Mining\n2. Transaction\n3. Check Port\n4. List Transaction Record\n5. Get Block\n6. My address\nYour Option:`, ans => {
      if (ans==1){
        const promise = async(port,doc_code)=>{
          const mine = require('./mine')
          await mine.mining(doc_code)
          .then(
            ()=>{
              let client = require("./src/network/client")
              client.postChain(port,doc_code)
            }
          )
        }
        promise(port,doc_code)
      }
      else if (ans==2){
        readline.question("Who do you want to transfer to?",req_doc_code=>{
          const promise = async(port,doc_code,req_doc_code)=>{
            let client = require("./src/network/client")
            await client.transact(doc_code,req_doc_code)
            .then(
              ()=>{
                client.postChain(port,doc_code)
              }
            )
          }
          promise(port,doc_code,req_doc_code)
        })
      }
      else if (ans==3){
        console.log(chalk.green("Your port:",port))
        recursiveAsyncReadLine(readline,port,doc_code)
      }

      else if(ans==4){
        const utxo = require('./src/utxo')
        utxo.utxo_list(doc_code)
        recursiveAsyncReadLine(readline,port,doc_code)
      }

      else if(ans==5){
        readline.question('Get Block from <Port_Number>: ', req_port => {
          const promise = async(req_port,doc_code)=>{
            let client = require("./src/network/client")
            await client.getChain(req_port,doc_code)
          }
          promise(req_port,doc_code)
        })
        recursiveAsyncReadLine(readline,port,doc_code)
      }
      else if(ans==6){
        var hash = require("crypto-js/sha256");
        console.log(chalk.green("Your Address:",hash(doc_code).toString()))
        recursiveAsyncReadLine(readline,port,doc_code)
      }    
    }
    );
  };



async function main(){
  const {port,doc_code} = await server.runServer()
  
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  })
  recursiveAsyncReadLine(readline,port,doc_code)
}

main()