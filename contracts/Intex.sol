pragma solidity ^0.7.1;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract Intex is ERC20 {
    using SafeMath for uint256;

    address public owner;

    /// @dev Eth exchange rate
    uint256 public ethExchangeRate;

    constructor(uint256 initialSupply) ERC20("IntelligenceExchange", "INTX")
    {
        owner = msg.sender;
        _mint(msg.sender, initialSupply); // By default, ERC20 uses a value of 18 for decimals. Unit is 1 * 10**18.
        ethExchangeRate = uint256(10**6); // 1 ETH -> 1M INTX tokens
    }

    /// @dev Get INTX tokens in exchange of ETH
    function getTokens() public payable
    {
        uint256 tokens = msg.value.mul(ethExchangeRate);
        _mint(msg.sender, tokens);
    }

    /// @dev Owner can widraw ETH and transfer to beneficiary
    function withdraw(address payable beneficiary, uint256 amount) public
    {
        require(msg.sender == owner);
        beneficiary.transfer(amount);
    }

    /// @dev Owner can set exchange rate
    function setEthExchangeRate(uint256 rate) external
    {
        require(msg.sender == owner, "Sender must be owner");
        require(rate > 0, "Rate must be greater than zero");
        ethExchangeRate = rate;
    }
}
