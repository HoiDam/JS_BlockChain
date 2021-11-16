const server = require("./src/network/server")

var recursiveAsyncReadLine = async function (readline,port) {
  readline.question(
    `What operation you would like to conduct?\n1. Mining\n2. Transaction\n3. Check Port\nYour Option:`, ans => {
      if (ans==1){
        console.log(1)
      }
      else if (ans==2){
        console.log(2)
      }
      else if (ans==3){
        console.log(port)
      }
      // else if(ans==4){
      //   readline.close()
      // }
    recursiveAsyncReadLine(readline,port)
    }

  );
};


async function main(){
  const port = await server.runServer()
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  })
  recursiveAsyncReadLine(readline,port)
}

main()