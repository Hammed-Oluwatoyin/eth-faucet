const Faucet = artifacts.require("Faucet");

module.exports = async function (deployer) {
  await deployer.deploy(Faucet);
};
