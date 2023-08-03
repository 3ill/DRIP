const { ethers } = require('hardhat');
require('dotenv').config();
const { THRILL } = process.env;

const main = async () => {
  const Faucet = await ethers.getContractFactory('Faucet');
  const faucet = await Faucet.deploy(THRILL);

  const faucetAddress = await faucet.getAddress();
  console.log(`Faucet deployed at => ${faucetAddress}`);
};

main().catch((error) => {
  process.exitCode = 1;
  console.error(error);
});
