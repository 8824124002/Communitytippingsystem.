// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CommunityTippingSystem {
    address public owner;

    event TipSent(address indexed sender, address indexed recipient, uint256 amount);

    mapping(address => uint256) public balances;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    function tip(address recipient) public payable {
        require(msg.value > 0, "Tip amount must be greater than 0");

        balances[recipient] += msg.value;
        emit TipSent(msg.sender, recipient, msg.value);
    }

    function withdraw() public {
        uint256 balance = balances[msg.sender];
        require(balance > 0, "No balance to withdraw");

        balances[msg.sender] = 0;

        payable(msg.sender).transfer(balance);
    }

    function checkBalance(address user) public view returns (uint256) {
        return balances[user];
    }

   function changeOwner(address newOwner) public onlyOwner {
        owner = newOwner;
    }
}
