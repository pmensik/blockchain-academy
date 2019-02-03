pragma solidity 0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";

contract GameToken is ERC20, ERC20Detailed {

    constructor (string memory name, string memory symbol, uint8 decimals)
    ERC20Detailed(name, symbol, decimals) public {
    }

    function mint(address to, uint256 value) public returns (bool) {
        _mint(to, value);
        return true;
    }
}
