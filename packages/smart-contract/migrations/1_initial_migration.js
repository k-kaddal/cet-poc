const LoanContract = artifacts.require("Migrations");

module.exports = function (deployer) {
  deployer.deploy(LoanContract);
};
