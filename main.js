const server = require("./src/network/server")

var recursiveAsyncReadLine = async function (readline,port,doc_code) {
  readline.question(
    `What operation you would like to conduct?\n1. Mining\n2. Transaction\n3. Check Port\n4. List Transaction Record\n5. Create Wallet\nYour Option:`, ans => {
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
          readline.question('What is the address of recipient: ', recipient=>{
            readline.question('What is the amount of coin you want to transfer: ', amount=>{
              const promise = async(port,doc_code)=>{
                const transaction = require('./src/transaction')
                transaction.transaction(sender,recipient,amount)
                .then(
                  ()=>{
                    let client = require("./src/network/client")
                    client.postChain(port,doc_code)
                  }
                )
          }
          promise(port,doc_code);
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
          const fs = require('fs');
          const EC = require('elliptic').ec;
          const ec = new EC('secp256k1');
              
          const key = ec.genKeyPair();
          const public_key = key.getPublic('hex');
          const private_key = key.getPrivate('hex');
          
          const key_pairs = {"Port": "1","Private_key": private_key, "Public_key": public_key};
          const data = JSON.stringify(key_pairs);
          
          fs.writeFile('keys.json', data,(err)=>{
              if(err){
                  throw err;
              }
           
              console.log('Your public key/wallet address : \n\n',public_key);
              console.log('\nYour private key to sign a transaction : \n\n',private_key);     
              
          
        })
      }   
  })
}



async function main(){
  const {port,doc_code} = await server.runServer()
  
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  })
  recursiveAsyncReadLine(readline,port,doc_code)
}

main()