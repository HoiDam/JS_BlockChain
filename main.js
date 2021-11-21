//const { key } = require("./src/key");
const server = require("./src/network/server")



var recursiveAsyncReadLine = async function (readline,port,doc_code) {
  readline.question(
    `What operation you would like to conduct?\n1. Mining\n2. Transaction\n3. Check Port\n4. List Transaction Record\n5. Get Block\nYour Option:`, ans => {
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

        // console.log(1)
      }
      else if (ans==2){
        // console.log(2)
        readline.question('What is your address: ', sender => {
          readline.question('What is the address of recipient: ', receiver=>{
            readline.question('What is the amount of coin you want to transfer: ', amount=>{
              const promise = async(port,doc_code)=>{
                const transaction = require('./transaction')
                await transaction.transaction(sender,receiver,amount)
                .then(
                  ()=>{
                    let client = require("./src/network/client")
                    client.postChain(port,doc_code)
                  }
                )
          }
            })
            
          })
          
    })
    }
    else if (ans==3){
        console.log(port)
        recursiveAsyncReadLine(readline,port,doc_code)
      }
      else if(ans==4){
        readline.question('What is the address you want to check: ', address => {
          const promise = async(address,doc_code)=>{
            const utxo = require('./utxo')
            await utxo.utxo(address,doc_code)
            .then(
              ()=>{
                let client = require("./transaction")
                client.postChain(port,doc_code)
              }
            )
    
            
          }
        })
      }

      else if(ans==5){
        readline.question('Get Block from <Port_Number>: ', req_port => {
          const promise = async(req_port,doc_code)=>{
            let client = require("./src/network/client")
            await client.getChain(req_port,doc_code)
          }
          promise(req_port,doc_code)
        })
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