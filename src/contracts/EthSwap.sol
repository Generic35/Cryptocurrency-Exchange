pragma solidity ^0.5.0;
import "./Token.sol";
contract EthSwap {
	string public name = "EthSwap Instant Exchange";
	Token public token;
	uint rate = 100;

	event TokenPurchase(
		address account, 
		address token,
		uint amount,
		uint rate
	);
	constructor(Token _token) public {
		token = _token;
	}

	function buyTokens() public payable {
		uint tokenAmount = msg.value * 100;

		// require ethSwap has enough tokens
		require(token.balanceOf(address(this)) >= tokenAmount);

		// transfers tokens to the user
		token.transfer(msg.sender, tokenAmount);
		emit TokenPurchase(msg.sender, address(token), tokenAmount, rate);
	}

	function sellTokens(uint _amount) public {
		uint etherAmount = _amount / rate;

		// take the user's tokens
		token.transferFrom(msg.sender, address(this), _amount);

		// give him the corresponding ether
		msg.sender.transfer(etherAmount);
	}

}