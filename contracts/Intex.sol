pragma solidity ^0.7.1;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract Intex is ERC20 {
    using SafeMath for uint256;

    address public owner;

    constructor(uint256 initialSupply) ERC20("IntelligenceExchange", "INTX")
    {
        owner = msg.sender;
        _mint(msg.sender, initialSupply); // By default, ERC20 uses a value of 18 for decimals. Unit is 1 * 10**18.
    }

    // Get INTX tokens in exchange of ETH
    function getTokens() public payable
    {
        uint256 exchangeRate = uint256(10**6); // 1 ETH -> 1M INTEX tokens
        uint256 tokens = msg.value.mul(exchangeRate);
        _mint(msg.sender, tokens);
    }

    // Owner can widraw ETH and transfer to beneficiary
    function withdraw(address payable beneficiary, uint256 amount) public
    {
        require(msg.sender == owner);
        beneficiary.transfer(amount);
    }
}
