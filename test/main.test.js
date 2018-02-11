const { Transaction, BlockChain, Block } = require('../src/main')
const assert = require('assert')

describe('BlockChain', () => {
  let subject
  const amount1 = 4
  const amount2 = 8
  const difficulty = 2

  beforeEach(() => {
    subject = new BlockChain(difficulty)
    subject.createTransaction(new Transaction('fish', 'pork', amount1))
    subject.createTransaction(new Transaction('fish', 'pork', amount2))
    subject.minePendingTransations('miner')
  })

  it('creates a new genesis block', () => {
    const subject = new BlockChain()
    assert.deepStrictEqual(subject.chain[0].prevHash, '0')
  })

  it('creates a chain of blocks', () => {
    assert.deepStrictEqual(subject.chain.length, 2)
  })

  it('has hash with the same number of starting zeros as difficulty number', () => {
    assert.equal(subject.getLatestBlock().hash.substring(0, difficulty).length, difficulty)
  })

  describe('#isChainValid', () => {
    it('returns false when block is tampered', () => {
      subject.chain[1] = new Block(Date.now(), new Transaction('fish', 'pork', 1000), 'tampered hash')
      assert.deepStrictEqual(subject.isChainValid(), false)
    })

    it('returns true when block is not tampered', () => {
      assert.ok(subject.isChainValid())
    })
  })

  describe('#getBalanceOfAddress', () => {
    it('returns the correct of sender', () => {
      assert.equal(subject.getBalanceOfAddress('fish'), 0 - amount1 - amount2)
    })

    it('returns the correct of receiver', () => {
      assert.equal(subject.getBalanceOfAddress('pork'), amount1 + amount2)
    })
  })
})
