// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Faucet {
    //storage Variables
    uint256 public funds = 1000;

    receive() external payable {}
    function addFunds() external payable  {}
}
