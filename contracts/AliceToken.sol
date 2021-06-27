// SPDX-License-Identifier: MIT
pragma solidity >=0.8.5 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AliceToken is ERC20("AliceToken", "ATC"), Ownable {
  constructor() {
    _mint(msg.sender, 10000 ether);
  }
}
