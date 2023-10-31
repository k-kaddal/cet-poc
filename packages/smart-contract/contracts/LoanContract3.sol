// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract LoanContract3 {
    address public owner;
    address payable public ethPool;

    // Mapping to track active loans
    mapping(uint256 => Loan) public loans;

    // A struct to represent a loan
    struct Loan {
        address borrower;
        uint256 amount;
        uint256 duration;
        uint256 startTime;
        bool active;
    }

    // Events to log important contract activities
    event LoanCreated(uint256 loanId, address borrower, uint256 amount);
    event LoanRepaid(uint256 loanId);
    event PoolToppedUp(uint256 amount);


    // Modifier to restrict access to the contract owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    constructor() {
        owner = msg.sender;
        ethPool = payable(address(this));
    }

    // Function to allow a user to collateralize an NFT and borrow money
    function borrowLoan(uint256 amount, uint256 duration) external {

        // Transfer ETH from the pool to the borrower
        require(ethPool.balance >= amount, "Not enough ETH in the pool");
        payable(msg.sender).transfer(amount);

        // Create a new loan
        uint256 loanId = uint256(keccak256(abi.encodePacked(msg.sender, block.number, block.timestamp)));
        
        loans[loanId] = Loan(msg.sender, amount, duration, block.timestamp, true);

        emit LoanCreated(loanId, msg.sender, amount);
    }

    // Function to repay a loan
    function repayLoan(uint256 loanId) external payable{
        Loan storage loan = loans[loanId];
        require(loan.active, "Loan is not active");
        require(msg.sender == loan.borrower, "Only the borrower can repay the loan");

        // Calculate the total repayment amount including interest
        uint256 endTime = loan.startTime + loan.duration;
        require(block.timestamp <= endTime, "Loan duration has expired");
        
        require(msg.value >= loan.amount, "Insufficient ETH sent for repayment");

        // Transfer the repayment to the contract owner
        payable(ethPool).transfer(msg.value);

        // Mark the loan as repaid
        loan.active = false;

        emit LoanRepaid(loanId);
    }

    // Function to allow the owner to top up the ethPool with Ether
    function topUpPool() external payable {
        // Transfer the sent Ether to the ethPool
        ethPool.transfer(msg.value);

        // Emit an event to log the amount topped up
        emit PoolToppedUp(msg.value);
    }

}
