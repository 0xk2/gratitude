const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Gratitude", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function initData() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const Gratitude = await ethers.getContractFactory("Gratitude");
    const gratitude = await Gratitude.deploy();

    return { gratitude, owner, otherAccount };
  }

  describe("Send Gratitute", function () {
    it("Should issue the gratitute to bob", async function () {
      const { gratitude } = await loadFixture(initData);
      //expect(await lock.unlockTime()).to.equal(unlockTime);
    });
  });
});
