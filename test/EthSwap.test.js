const { assert } = require("chai");
const { FormControlStatic } = require("react-bootstrap");

const Token = artifacts.require('Token');
const EthSwap = artifacts.require('EthSwap');

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('EthSwap', (accounts) => {
	describe('Token deployement', async () => {
		it('contract has a name', async () => {
			let token = await Token.new();
			const name = await token.name();
			assert.equal(name, 'DApp Token')

		})
	})

	describe('EthSwap deployement', async () => {
		it('contract has a name', async () => {
			let ethSwap = await EthSwap.new();
			const name = await ethSwap.name();
			assert.equal(name, 'EthSwap Instant Exchange')

		})

		it('contract has tokens', async () => {
			let token = await Token.new();
			let ethSwap = await EthSwap.new();
			await token.transfer(ethSwap.address, '1000000000000000000000000')
			let balance = await token.balanceOf(ethSwap.address);
			assert.equal(balance.toString(), '1000000000000000000000000')
		})
	})

})