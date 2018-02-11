const crypto = require('crypto')

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress
    this.toAddress = toAddress
    this.amount = amount
  }
}

class Block {
  constructor(timestamp, transactions, prevHash = '') {
    this.timestamp = timestamp
    this.transactions = transactions
    this.prevHash = prevHash
    this.hash = this.calculateHash()
    this.nonce = 0
  }

  calculateHash() {
    return crypto.createHmac('sha256', `${this.timestamp}${JSON.stringify(this.transactions)}${this.prevHash}${this.nonce}`).digest('hex')
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
    this.pendingTransactions = []
    this.miningReward = 100
  }

  createGenesisBlock() {
    return new Block('01/01/2018', [], '0')
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1]
  }

  createTransaction(transaction) {
    this.pendingTransactions.push(transaction)
  }

  minePendingTransations(miningRewardAddress) {
    const block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash)
    block.mineBlock(this.difficulty)

    this.chain.push(block)

    this.pendingTransactions = [
      new Transaction(null, miningRewardAddress, this.miningReward)
    ]
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
  Transaction,
  Block,
  BlockChain
}
