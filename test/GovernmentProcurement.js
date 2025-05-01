const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GovernmentProcurement", function () {
  let GovernmentProcurement, governmentProcurement, owner, supplier, otherAccount;

  beforeEach(async function () {
    GovernmentProcurement = await ethers.getContractFactory("GovernmentProcurement");
    [owner, supplier, otherAccount] = await ethers.getSigners();
    governmentProcurement = await GovernmentProcurement.deploy();
    await governmentProcurement.waitForDeployment();
  });

  it("Should set the right owner", async function () {
    expect(await governmentProcurement.government()).to.equal(owner.address);
  });

  it("Should create a contract", async function () {
    await governmentProcurement.createContract(
      supplier.address,
      "Procurement 1",
      { value: ethers.parseEther("1.0") }
    );

    const contractData = await governmentProcurement.contracts(0);

    expect(contractData.description).to.equal("Procurement 1");
    expect(contractData.amount).to.equal(ethers.parseEther("1.0"));
    expect(contractData.status).to.equal(0); // Created
  });

  it("Should mark a contract as completed", async function () {
    await governmentProcurement.createContract(
      supplier.address,
      "Procurement 1",
      { value: ethers.parseEther("1.0") }
    );

    await governmentProcurement.connect(supplier).markCompleted(0);

    const updatedContract = await governmentProcurement.contracts(0);
    expect(updatedContract.status).to.equal(1); // Completed
  });

  it("Should revert if non-owner tries to create a contract", async function () {
    await expect(
      governmentProcurement.connect(otherAccount).createContract(
        supplier.address,
        "Procurement 2",
        { value: ethers.parseEther("1.0") }
      )
    ).to.be.revertedWith("Only government can perform this action");
  });

  it("Should revert if non-supplier tries to complete a contract", async function () {
    await governmentProcurement.createContract(
      supplier.address,
      "Procurement 1",
      { value: ethers.parseEther("1.0") }
    );

    await expect(
      governmentProcurement.connect(otherAccount).markCompleted(0)
    ).to.be.revertedWith("Only assigned supplier can perform this action");
  });

  it("Should release payment when contract is completed", async function () {
    await governmentProcurement.createContract(
      supplier.address,
      "Procurement 1",
      { value: ethers.parseEther("1.0") }
    );

    await governmentProcurement.connect(supplier).markCompleted(0);

    const initialBalance = await ethers.provider.getBalance(supplier.address);

    const tx = await governmentProcurement.releasePayment(0);
    await tx.wait();

    const finalBalance = await ethers.provider.getBalance(supplier.address);

    const balanceDifference = finalBalance.sub(initialBalance);

    expect(balanceDifference).to.equal(ethers.parseEther("1.0"));
  });
});
