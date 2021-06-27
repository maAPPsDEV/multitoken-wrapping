// SPDX-License-Identifier: MIT
pragma solidity >=0.8.5 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./CharlieToken.sol";

contract Wrapper is Ownable {
  CharlieToken private outputToken;

  constructor(address outputTokenAddress) {
    outputToken = CharlieToken(outputTokenAddress);
  }

  /**
   * Convert an amount of input token_ to an equivalent amount of the output token
   *
   * @param token_ address of token to swap
   * @param amount amount of token to swap/receive
   */
  function swap(address token_, uint256 amount) external {
    IERC20 inputToken = IERC20(token_);
    address currentAddress = address(this);
    require(inputToken.allowance(msg.sender, currentAddress) >= amount, "Wrapper: Insufficient Allowance.");

    // Transfer A || B token from sender to wrapper
    inputToken.transferFrom(msg.sender, currentAddress, amount);

    // Mint the give amount of C token
    outputToken.mintForWrapper(amount);

    // Transfer C token to sender
    outputToken.transfer(msg.sender, amount);
  }

  /**
   * Convert an amount of the output token to an equivalent amount of input token_
   *
   * @param token_ address of token to receive
   * @param amount amount of token to swap/receive
   */
  function unswap(address token_, uint256 amount) external {
    IERC20 inputToken = IERC20(token_);
    address currentAddress = address(this);
    require(outputToken.allowance(msg.sender, currentAddress) >= amount, "Wrapper: Insufficient Allowance.");
    require(inputToken.balanceOf(currentAddress) >= amount, "Wrapper: Insufficient Balance.");

    // Transfer C token from sender to wrapper
    outputToken.transferFrom(msg.sender, currentAddress, amount);

    // Burn the given amount of C token
    outputToken.burnForWrapper(amount);

    // Transfer A || B token to sender
    inputToken.transfer(msg.sender, amount);
  }

  /**
   * Transfer input token to the owner, only way to take the balance for the owner
   *
   * @param token_ address of token to transfer
   * @param amount amount of token
   */
  function transfer(address token_, uint256 amount) external onlyOwner {
    IERC20 inputToken = IERC20(token_);
    address currentAddress = address(this);
    require(inputToken.balanceOf(currentAddress) > amount, "Wrapper: Insufficient Balance.");
    inputToken.transfer(msg.sender, amount);
  }
}
