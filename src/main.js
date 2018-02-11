const crypto = require('crypto')

class Block {
  constructor(timestamp, data, prevHash = '') {
    this.timestamp = timestamp
    this.data = data
    this.prevHash = prevHash
    this.hash = this.calculateHash()
    this.nonce = 0
  }

  calculateHash() {
    return crypto.createHmac('sha256', `${this.timestamp}${JSON.stringify(this.data)}${this.prevHash}${this.nonce}`).digest('hex')
  }

  mineBlock(difficulty) {
    const zeros = new Array(difficulty + 1).join('0')
    while (this.hash.substring(0, difficulty) !== new Array(difficulty + 1).join('0')) {
      this.nonce++
      this.hash = this.calculateHash()
    }
  }
}

class BlockChain {
  constructor(difficulty = 2) {
    this.chain = [this.createGenesisBlock()]
    this.difficulty = difficulty
  }

  createGenesisBlock() {
    return new Block('01/01/2018', 'Genesis Block', '0')
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1]
  }

  addBlock(newBlock) {
    newBlock.prevHash = this.getLatestBlock().hash
    newBlock.mineBlock(this.difficulty)
    this.chain.push(newBlock)
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i]
      const prevBlock = this.chain[i - 1]

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false
      }

      if (currentBlock.prevHash !== prevBlock.hash) {
        return false
      }
    }

    return true
  }
}

module.exports = {
  Block,
  BlockChain
}
