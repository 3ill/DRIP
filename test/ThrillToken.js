const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('Thrill Token', async () => {
  let thrillToken;
  let cap = 100000000;
  let blockReward = 10;
  const [Owner, account1, account2] = await ethers.getSigners();

  const formatter = (_cap) => {
    return ethers.formatEther(_cap);
  };

  beforeEach(async () => {
    const tokenName = 'Thrill Token';
    const symbol = '3ILL';
    const ThrillToken = await ethers.getContractFactory('Thrill');
    thrillToken = await ThrillToken.deploy(tokenName, symbol);
  });

  describe('Deployment', async () => {
    it('Should set the right owner', async () => {
      const ownerAddress = Owner.address;
      const contractOwner = await thrillToken.Owner();
      expect(contractOwner).to.equal(ownerAddress);
    });

    it('Should assert the tokenCap', async () => {
      const maxSupply = await thrillToken.maxSupply();
      const capTX = Number(formatter(maxSupply));
      expect(capTX).to.equal(cap);
    });

    it('Should assert block reward', async () => {
      const BlockTX = await thrillToken.blockReward();
      expect(Number(formatter(BlockTX))).to.equal(blockReward);
    });
  });

  describe('Token Transfer', async () => {
    it('Should send 50 tokens to the first address', async () => {
      await thrillToken.transfer(account1.address, 50);
      let accountBalance = await thrillToken.balanceOf(account1.address);
      expect(accountBalance).to.equal(50);

      await thrillToken.connect(account1).transfer(account2.address, 20);
      accountBalance = await thrillToken.balanceOf(account2.address);
      expect(accountBalance).to.equal(20);
    });

    it('Should mint a token', async () => {
      await thrillToken.connect(account2).mint(account2.address, 50);
      let accountBalance = await thrillToken.balanceOf(account2.address);
      expect(accountBalance).to.equal(50);
    });

    it('Should fail due to insufficient tokens', async () => {
      const initialBalance = await thrillToken.balanceOf(account1.address);

      expect(
        await thrillToken.connect(account1).transfer(account2.address, 10)
      ).to.be.revertedWith('ERC20: transfer amount exceeds balance');

      expect(await thrillToken.balanceOf(account1.address)).to.equal(
        initialBalance
      );
    });
  });
});
