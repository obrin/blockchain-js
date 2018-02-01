const crypto = require('crypto')

class Block {
  constructor(index, timestamp, data, prevHash = '') {
    this.index = index
    this.timestamp = timestamp
    this.data = data
    this.prevHash = prevHash
    this.hash = this.calculateHash()
  }

  calculateHash() {
    // console.log(crypto.createHmac('sha256', `${this.index}${this.timestamp}${JSON.stringify(this.data)}${this.prevHash}`))
    return crypto.createHmac('sha256', `${this.index}${this.timestamp}${JSON.stringify(this.data)}${this.prevHash}`).digest('hex')
  }
}

class BlockChain {
  constructor() {
    this.chain = [this.createGenesisBlock()]
  }

  createGenesisBlock() {
    return new Block(0, '01/01/2018', 'Genesis Block', '0')
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1]
  }

  addBlock(newBlock) {
    newBlock.prevHash = this.getLatestBlock().hash
    newBlock.hash = newBlock.calculateHash()
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
