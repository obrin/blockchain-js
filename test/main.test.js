const { BlockChain, Block } = require('../src/main')
const assert = require('assert')

describe('BlockChain', () => {
  it('creates a new genesis block', () => {
    const subject = new BlockChain()

    assert.deepStrictEqual(subject.chain[0].index, 0)
  })

  it('creates a chain of blocks', () => {
    const subject = new BlockChain()
    subject.addBlock(new Block(1, '01/01/2018', { amount: 4 }))
    subject.addBlock(new Block(2, '02/01/2018', { amount: 8 }))

    assert.deepStrictEqual(subject.chain.length, 3)
  })

  describe('#isChainValid', () => {
    it('returns false when block is tampered', () => {
      const subject = new BlockChain()
      subject.addBlock(new Block(1, '01/01/2018', { amount: 4 }))
      subject.addBlock(new Block(2, '02/01/2018', { amount: 8 }))

      // Tamper blockchain
      subject.chain[1].data = { amount: 100 };

      assert.deepStrictEqual(subject.isChainValid(), false)
    })

    it('returns true when block is not tampered', () => {

      const subject = new BlockChain()
      subject.addBlock(new Block(1, '01/01/2018', { amount: 4 }))
      subject.addBlock(new Block(2, '02/01/2018', { amount: 8 }))

      console.log(subject.isChainValid())

      assert.ok(subject.isChainValid())
    })
  })
})