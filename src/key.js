class key {
        constructor() {}
    
key_gen(){
const fs = require('fs');

    const EC = require('elliptic').ec;
    const ec = new EC('secp256k1');
    
    const key = ec.genKeyPair();
    const public_key = key.getPublic('hex');
    const private_key = key.getPrivate('hex');

    const key_pairs = {"Private_key": private_key, "Public_key": public_key};
    const data = JSON.stringify(key_pairs);


fs.writeFile('keys.json', data,(err)=>{

    if(err){
        throw err;
    }
 
    console.log('Your public key/wallet address : \n',public_key);
    console.log('\nYour private key to sign a transaction : \n\n',private_key);     
    

})

}
}
module.exports.key = key;