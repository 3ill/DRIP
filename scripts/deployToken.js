const { ethers } = require('hardhat');

const main = async () => {
  const tokenName = 'Thrill Token';
  const symbol = '3ILL';
  const ThrillToken = await ethers.getContractFactory('Thrill');
  const thrill = await ThrillToken.deploy(tokenName, symbol);

  await thrill.waitForDeployment();

  console.log(`Contract deployed at => ${await thrill.getAddress()}`);
};

main().catch((error) => {
  process.exitCode = 1;
  console.log(error);
});
