var Token = artifacts.require("./GameToken.sol");

module.exports = function(deployer) {
  deployer.deploy(Token, "GameToken", "GT", 0);
};
