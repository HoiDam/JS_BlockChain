const server = require("./src/network/server")
const mine = require('./mine')

const defaultPort = 3000

var recursiveAsyncReadLine = async function (readline,port,doc_code) {
  readline.question(
    `What operation you would like to conduct?\n1. Mining\n2. Transaction\n3. Check Port\nYour Option:`, ans => {
      if (ans==1){
        mine.mining(doc_code)
        // console.log(1)
      }
      else if (ans==2){
        console.log(2)
      }
      else if (ans==3){
        console.log(port)
        recursiveAsyncReadLine(readline,port,doc_code)
      }
      // else if(ans==4){
      //   readline.close()
      // }
    
    }

  );
};


async function main(){
  const port = await server.runServer()
  const doc_code = String.fromCharCode("A".charCodeAt(0) + port-defaultPort);
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  })
  recursiveAsyncReadLine(readline,port,doc_code)
}

main()