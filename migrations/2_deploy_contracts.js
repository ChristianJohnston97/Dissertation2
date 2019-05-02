const TutorialToken = artifacts.require('./TutorialToken.sol')
const Users = artifacts.require('./Users.sol')
const Verify = artifacts.require('./Verify.sol')
const Sellers = artifacts.require('./Sellers.sol')
const LogIn = artifacts.require('./LoggedIn.sol')
const IPFS = artifacts.require('./IPFS.sol')


module.exports = function (deployer) {
  deployer.deploy(Users);
  deployer.deploy(Verify);
  deployer.deploy(LogIn);
  deployer.deploy(IPFS);


  // passing constructor arguments (address of tutorial token contract) to seller contract
  deployer.deploy(TutorialToken).then(function() {
    return deployer.deploy(Sellers, TutorialToken.address);
  });


}
