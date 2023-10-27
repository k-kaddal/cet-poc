// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Import OpenZeppelin for and Ownable
import "@openzeppelin/contracts/access/Ownable.sol";

contract LoanContract is Ownable {
    // Struct to represent a loan
    struct Loan {
        address borrower;
        uint256 collateralAmount;
        uint256 loanAmount;
        uint256 dueDate;
        bool repaid;
    }

    // Mapping from loan ID to Loan
    mapping(uint256 => Loan) public loans;

    uint256 public nextLoanId = 1;

    // Events to log important contract actions
    event LoanCreated(uint256 loanId, address borrower, uint256 collateralAmount, uint256 loanAmount, uint256 dueDate);
    event LoanRepaid(uint256 loanId);

    constructor() Ownable(msg.sender) {}

    // Function to create a new loan
    function createLoan(uint256 _collateralAmount, uint256 _loanAmount, uint256 _dueDate) external payable{
        require(_collateralAmount > 0, "Collateral amount must be greater than 0");
        require(_loanAmount > 0, "Loan amount must be greater than 0");
        require(_dueDate > block.timestamp, "Due date must be in the future");

        // Transfer collateral from the borrower to the contract
        require(msg.value == _collateralAmount, "Collateral value does not match the provided value");

        loans[nextLoanId] = Loan({
            borrower: msg.sender,
            collateralAmount: _collateralAmount,
            loanAmount: _loanAmount,
            dueDate: _dueDate,
            repaid: false
        });

        // Emit a LoanCreated event
        emit LoanCreated(nextLoanId, msg.sender, _collateralAmount, _loanAmount, _dueDate);

        nextLoanId++;
    }

    // Function to repay a loan
    function repayLoan(uint256 loanId) external payable {
        Loan storage loan = loans[loanId];

        require(loan.borrower == msg.sender, "Only the borrower can repay the loan");
        require(!loan.repaid, "Loan has already been repaid");
        require(msg.value == loan.loanAmount, "Amount sent does not match the loan amount");

        loan.repaid = true;

        // Transfer the collateral back to the borrower
        payable(msg.sender).transfer(loan.collateralAmount);

        // Emit a LoanRepaid event
        emit LoanRepaid(loanId);
    }
}
