require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();
require('solidity-coverage');
const { GOERLI_URL, PRIVATE_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.18',
  networks: {
    goerli: {
      url: GOERLI_URL,
      accounts: [`0x${PRIVATE_KEY}`],
      chainId: 5,
      blockConfirmations: 1,
    },
  },
};
