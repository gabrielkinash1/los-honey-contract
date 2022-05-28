const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

describe("Greeter", function () {
  let losHoney, accounts;
  beforeEach(async function () {
    const payableAddress = "0x812f7aDCDf2685447Bf3327dd908832e202904d3";
    const metadataURI = "";
    const LosHoney = await ethers.getContractFactory("LosHoney");
    losHoney = await LosHoney.deploy(payableAddress, metadataURI);
    await losHoney.deployed();
    await losHoney.togglePause();
    accounts = await ethers.getSigners();
  });

  it("Should return the balance after buying 1000 NFTs", async function () {
    const quantity = 100;
    let mintPrice = BigNumber.from(await losHoney.mintPrice());
    mintPrice = await ethers.utils.formatUnits(mintPrice, 18);
    const price = await ethers.utils.parseUnits(
      String(mintPrice * quantity),
      18
    );
    for (let i = 0; i < 10; i++) {
      const txn = await losHoney.mint(quantity, { value: price });
      await txn.wait();
    }
    expect(await losHoney.balanceOf(accounts[0].address)).to.be.equal(
      quantity * 10
    );
  });

  it("Should return the balance after buying 1 NFT", async function () {
    const quantity = 1;
    let mintPrice = BigNumber.from(await losHoney.mintPrice());
    mintPrice = await ethers.utils.formatUnits(mintPrice, 18);
    const price = await ethers.utils.parseUnits(
      String(mintPrice * quantity),
      18
    );
    const txn = await losHoney.mint(quantity, { value: price });
    await txn.wait();
    expect(await losHoney.balanceOf(accounts[0].address)).to.be.equal(quantity);
  });

  it("Should return the balance after giving 1000 NFTs", async function () {
    const quantity = 100;
    for (let i = 0; i < 10; i++) {
      const txn = await losHoney.give(accounts[0].address, quantity);
      await txn.wait();
    }
    expect(await losHoney.balanceOf(accounts[0].address)).to.be.equal(
      quantity * 10
    );
  });

  it("Should return the balance after giving 1 NFT", async function () {
    const quantity = 1;
    const txn = await losHoney.give(accounts[0].address, quantity);
    await txn.wait();
    expect(await losHoney.balanceOf(accounts[0].address)).to.be.equal(quantity);
  });
});
