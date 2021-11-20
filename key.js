const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const key = ec.genKeyPair();
const public_key = key.getPublic('hex');
const private_key = key.getPrivate('hex');

console.log();
console.log('Your public key (also your wallet address, freely shareable)\n', public_key);

console.log();
console.log('Your private key (keep this secret! To sign transactions)\n', private_key);
