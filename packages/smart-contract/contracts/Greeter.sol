// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Greeter {
  string greeting;

  constructor(){
    greeting = "Hello World";
  }

  function set(string memory _greeting) public {
    greeting = _greeting;
  }

  function get() public view returns (string memory) {
    return greeting;
  }

}
