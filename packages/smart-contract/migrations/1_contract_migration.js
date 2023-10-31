const LoanContract = artifacts.require("LoanContract3");

module.exports = function (deployer) {
  deployer.deploy(LoanContract);
};
