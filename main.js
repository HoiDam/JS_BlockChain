const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  })
  
  readline.question(`What operation you would like to conduct?\n1. Mining\n2. Transaction\n3. Exit\nYour Option:`, name => {
    console.log(`${name}!`)
    readline.close()
  })
  