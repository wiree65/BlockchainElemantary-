const SHA256 = require("crypto-js/sha256");
class Block {
  constructor(index, timestamp, data, previousHash = "") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }
  calculateHash() {
    return SHA256(
      this.index + this.previousHash + JSON.stringify(this.data) + this.nonce
    ).toString();
  }
  mineBlock(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log("block mined: " + this.hash);
  }
}

class BlockChain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 4;
  }
  createGenesisBlock() {
    return new Block(0, "19/03/2021", "Genesis Block", "0");
  }
  getLastestBlock() {
    return this.chain[this.chain.length - 1];
  }
  addBlock(newBlock) {
    newBlock.previousHash = this.getLastestBlock().hash;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }
  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}

let wireeCoin = new BlockChain();
console.log("Mining block 1...");
wireeCoin.addBlock(new Block(1, "19/03/2021", { amount: 4 }));
console.log("Mining block 2...");
wireeCoin.addBlock(new Block(2, "19/03/2021", { amount: 10 }));

// console.log(JSON.stringify(wireeCoin, null, 4));
// console.log("is blockchain valid: " + wireeCoin.isChainValid());

// wireeCoin.chain[1].data = { amount: 100 };
// wireeCoin.chain[1].hash = wireeCoin.chain[1].calculateHash();
// console.log("is blockchain valid: " + wireeCoin.isChainValid());
// console.log(JSON.stringify(wireeCoin, null, 4));
