const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

/**
 * The lending-case is odd with Ethereum design
 * since I have to design it within the scope of this smart contract, too many decisions.
 * Let's skip the lending for now
 */

describe("Gratitude", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function initData() {
    // Contracts are deployed using the first signer/account by default
    const [owner, alice, bob, caroline, dave] = await ethers.getSigners();

    const Gratitude = await ethers.getContractFactory("Gratitude");
    const FakeErc20 = await ethers.getContractFactory("FakeErc20");

    const gratitude = await Gratitude.deploy();
    const certHash1 = "this.is.a.cert.hash.1";
    const certHash2 = "this.is.a.cert.hash.2";

    const fakeErc20 = await FakeErc20.deploy();

    return { gratitude, owner, alice, bob, caroline, dave, certHash1, certHash2, fakeErc20 };
  }

  describe("Send Gratitute", function () {
    it("Should alice send the gratitute to bob and caroline with ethers", async function () {
      const { gratitude, alice, bob, caroline, certHash1, certHash2 } = await loadFixture(initData);
      
      await gratitude.connect(alice).sendEther([bob.address, caroline.address, bob.address],[10_000_000_000, 28_000_000_000, 10_000_000_000],[certHash1, certHash2, certHash2], {value: 100_000_000_000});
      const balance_after = await ethers.provider.getBalance(bob.address);
      // ether sent
      expect(await ethers.provider.getBalance(bob.address)).to.equal(ethers.BigNumber.from("10000000000020000000000"));
      expect(await ethers.provider.getBalance(caroline.address)).to.equal(ethers.BigNumber.from("10000000000028000000000"));
      // certs have been delivered
      expect(await gratitude.recipients(bob.address)).to.equal(2);
      expect(await gratitude.recipients(caroline.address)).to.equal(1);
      // cert content is correct
      const bob_record_1 = await gratitude.certs(bob.address,0);
      const bob_record_2 = await gratitude.certs(bob.address,1);
      const caroline_record_1 = await gratitude.certs(caroline.address,0);
      
      expect(bob_record_1.content).to.equal(certHash1);
      expect(bob_record_2.content).to.equal(certHash2);
      expect(caroline_record_1.content).to.equal(certHash2);
    });

    it("Should alice send the gratitude to bob and caroline with Token", async function(){
      const { gratitude, owner, alice, bob, caroline, certHash1, certHash2, fakeErc20 } = await loadFixture(initData);
      await fakeErc20.mint(alice.address, 1_000_000);
      await fakeErc20.connect(alice).approve(gratitude.address, 1_000_000);

      await gratitude.connect(alice).sendToken(fakeErc20.address, [bob.address, caroline.address, bob.address],[10_000, 28_000, 10_000],[certHash1, certHash2, certHash2]);
      await gratitude.connect(alice).sendToken(fakeErc20.address, [caroline.address],[10_000],[certHash1]);
      // Token sent
      expect(await fakeErc20.balanceOf(bob.address)).to.equal(20_000);
      expect(await fakeErc20.balanceOf(caroline.address)).to.equal(38_000);
      // certs have been delivered
      expect(await gratitude.recipients(bob.address)).to.equal(2);
      expect(await gratitude.recipients(caroline.address)).to.equal(2);
      // cert content is correct
      const bob_record_1 = await gratitude.certs(bob.address,0);
      const bob_record_2 = await gratitude.certs(bob.address,1);
      const caroline_record_1 = await gratitude.certs(caroline.address,0);
      const caroline_record_2 = await gratitude.certs(caroline.address,1);
      
      expect(bob_record_1.content).to.equal(certHash1);
      expect(bob_record_2.content).to.equal(certHash2);
      expect(caroline_record_1.content).to.equal(certHash2);
      expect(caroline_record_2.content).to.equal(certHash1);
    })
  });
});
