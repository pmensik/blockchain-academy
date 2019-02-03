pragma solidity ^0.5.2;

interface BidloCoin {
    function transferFrom(address from, address to, uint tokens) external;
}

contract Airdrop {

    BidloCoin public token;
    address public tokenHolder;
    uint private amountToTransfer;

    constructor (address addressOfToken, address addressOfHolder, uint fixedAmount) public {
        token = BidloCoin(addressOfToken);
        tokenHolder = addressOfHolder;
        amountToTransfer = fixedAmount;
    }

    function drop() public {
      token.transferFrom(tokenHolder, msg.sender, amountToTransfer);
    }
}
