const SHA256 = require("crypto-js/sha256");

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}

class Block {
  constructor(timestamp, transaction, previousHash = "") {
    this.timestamp = timestamp;
    this.transaction = transaction;
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
    this.difficulty = 2;
    this.pendingTransaction = [];
    this.miningReward = 100;
  }
  createGenesisBlock() {
    return new Block("19/03/2021", "Genesis Block", "0");
  }
  getLastestBlock() {
    return this.chain[this.chain.length - 1];
  }

  mindPeningTransaction(miningRewardAddress) {
    let block = new Block(Date.now(), this.pendingTransaction);
    block.mineBlock(this.difficulty);

    console.log("Block succesfully mined");
    this.chain.push(block);

    this.pendingTransaction = [
      new Transaction(null, miningRewardAddress, this.miningReward),
    ];
  }
  createTransaction(transaction) {
    this.pendingTransaction.push(transaction);
  }

  getBalanceOfAddress(address) {
    let balance = 0;
    for (const block of this.chain) {
      for (const trans of block.transaction) {
        if (trans.fromAddress === address) {
          balance -= trans.amount;
        }
        if (trans.toAddress === address) {
          balance += trans.amount;
        }
      }
    }
    return balance;
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

wireeCoin.createTransaction(new Transaction("address1", "address2", 100));
wireeCoin.createTransaction(new Transaction("address2", "address1", 50));

console.log("\n Starting the miner...");
wireeCoin.mindPeningTransaction("xaviers-address");
console.log(
  "\n Balance of xavier is ",
  wireeCoin.getBalanceOfAddress("xaviers-address")
);

console.log("\n Starting the miner again...");
wireeCoin.mindPeningTransaction("xaviers-address");
console.log(
  "\n Balance of xavier is ",
  wireeCoin.getBalanceOfAddress("xaviers-address")
);

// console.log("Mining block 1...");
// wireeCoin.addBlock(new Block(1, "19/03/2021", { amount: 4 }));
// console.log("Mining block 2...");
// wireeCoin.addBlock(new Block(2, "19/03/2021", { amount: 10 }));

// console.log(JSON.stringify(wireeCoin, null, 4));
// console.log("is blockchain valid: " + wireeCoin.isChainValid());

// wireeCoin.chain[1].data = { amount: 100 };
// wireeCoin.chain[1].hash = wireeCoin.chain[1].calculateHash();
// console.log("is blockchain valid: " + wireeCoin.isChainValid());
// console.log(JSON.stringify(wireeCoin, null, 4));
