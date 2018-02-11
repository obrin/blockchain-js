const { Transaction, BlockChain, Block } = require('../src/main')
const assert = require('assert')

describe('BlockChain', () => {
  it('creates a new genesis block', () => {
    const subject = new BlockChain()

    assert.deepStrictEqual(subject.chain[0].prevHash, '0')
  })

  it('creates a chain of blocks', () => {
    const subject = new BlockChain()
    subject.createTransaction(new Transaction('fish', 'pork', 4))
    subject.createTransaction(new Transaction('fish', 'pork', 8))
    subject.minePendingTransations('miner')

    assert.deepStrictEqual(subject.chain.length, 2)
  })

  describe('#isChainValid', () => {
    it('returns false when block is tampered', () => {
      const subject = new BlockChain()
      subject.createTransaction(new Transaction('fish', 'pork', 4))
      subject.createTransaction(new Transaction('fish', 'pork', 8))
      subject.minePendingTransations('miner')

      // Tamper blockchain
      subject.chain[1] = new Block(Date.now(), new Transaction('fish', 'pork', 1000), 'tampered hash')

      assert.deepStrictEqual(subject.isChainValid(), false)
    })

    it('returns true when block is not tampered', () => {
      const subject = new BlockChain()
      subject.createTransaction(new Transaction('fish', 'pork', 4))
      subject.createTransaction(new Transaction('fish', 'pork', 8))
      subject.minePendingTransations('miner')

      assert.ok(subject.isChainValid())
    })
  })

  context('proof of work', () => {
    it('has hash with the same number of starting zeros as difficulty number', () => {
      const difficulty = 2
      const subject = new BlockChain(difficulty)
      subject.createTransaction(new Transaction('fish', 'pork', 4))
      subject.createTransaction(new Transaction('fish', 'pork', 8))
      subject.minePendingTransations('miner')
      assert.equal(subject.getLatestBlock().hash.substring(0, difficulty).length, difficulty)
    })
  })

  describe('#getBalanceOfAddress', () => {
    let subject
    let amount1 = 4
    let amount2 = 8
    beforeEach(() => {
      subject = new BlockChain()
      subject.createTransaction(new Transaction('fish', 'pork', amount1))
      subject.createTransaction(new Transaction('fish', 'pork', amount2))
      subject.minePendingTransations('miner')
    })

    it('returns the correct of sender', () => {
      assert.equal(subject.getBalanceOfAddress('fish'), 0 - amount1 - amount2)
    })

    it('returns the correct of receiver', () => {
      assert.equal(subject.getBalanceOfAddress('pork'), amount1 + amount2)
    })
  })
})
