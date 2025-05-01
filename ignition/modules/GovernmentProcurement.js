// Add necessary module code for deployment here

// Import necessary modules and dependencies
const { ethers } = require("hardhat");

// Define the deployment script
async function deploy() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const GovernmentProcurement = await ethers.getContractFactory("GovernmentProcurement");
  const governmentProcurement = await GovernmentProcurement.deploy();

  console.log("GovernmentProcurement contract deployed to:", governmentProcurement.address);

  governmentProcurement.futures = [
    {
      name: "DeployContract",
      action: async () => {
        const contract = await GovernmentProcurement.deploy();
        await contract.deployed();
        return contract.address;
      }
    }
  ];
}

// Execute the deployment script
module.exports = deploy;