const { assert } = require("chai");
const { FormControlStatic } = require("react-bootstrap");
const { default: Web3 } = require("web3");

const Token = artifacts.require('Token');
const EthSwap = artifacts.require('EthSwap');

require('chai')
  .use(require('chai-as-promised'))
  .should()


function tokens(n) {
	return web3.utils.toWei(n, 'ether');
}

contract('EthSwap', ([deployer, investor ]) => {
	let token, ethSwap;
	before(async()=>{
		token = await Token.new();
		ethSwap = await EthSwap.new(token.address);
		await token.transfer(ethSwap.address, tokens('1000000'))
	})

	describe('Token deployement', async () => {
		it('contract has a name', async () => {
			const name = await token.name();
			assert.equal(name, 'DApp Token')

		})
	})

	describe('EthSwap deployement', async () => {
		it('contract has a name', async () => {
			const name = await ethSwap.name();
			assert.equal(name, 'EthSwap Instant Exchange')

		})

		it('contract has tokens', async () => {
			let balance = await token.balanceOf(ethSwap.address);
			assert.equal(balance.toString(), tokens('1000000'))
		})
	})

	describe('buyTokens()', async () => {
		let results;
		before(async()=>{
			results = await ethSwap.buyTokens({ from: investor, value: web3.utils.toWei('1', 'ether')});
		})
		it('Allows user to instntly purchase tokens from ethwap for a fixed price', async () => {
			// investor's token balance should have increased by 100
			let investorBalance = await token.balanceOf(investor);
			assert.equal(investorBalance, tokens('100'))

			let ethSwapBalance;
			// ethSwap token balance should have decreased by 100 tokens
			ethSwapBalance = await token.balanceOf(ethSwap.address);
			assert.equal(ethSwapBalance.toString(), tokens('999900'))
			// ethSwap ethereum balance should have increased by 1 Ether
			ethSwapBalance = await web3.eth.getBalance(ethSwap.address);
			assert(ethSwapBalance.toString(), web3.utils.toWei('1', 'Ether'));

		  // Check logs to ensure event was emitted with correct data
			const event = results.logs[0].args
			assert.equal(event.account, investor)
			assert.equal(event.token, token.address)
			assert.equal(event.amount.toString(), tokens('100').toString())
			assert.equal(event.rate.toString(), '100')
		})
	})
})