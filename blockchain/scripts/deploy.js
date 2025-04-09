require('dotenv').config()
const { ethers } = require("ethers");

// Load compiled contract
const compiledContract = require("../builds/compiledContract.json");

// Deployment function
const deploy = async () => {
  // Connect to the Sepolia testnet via Infura or Alchemy
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.SEPOLIA_RPC // Replace with your Infura/Alchemy URL
  );

  // Wallet setup with private key
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider); // Replace with your private key

  // Create a contract factory
  const factory = new ethers.ContractFactory(
    compiledContract.abi,
    compiledContract.bytecode,
    wallet
  );

  // Deploy the contract
  console.log("Deploying contract to Sepolia...");
  const contract = await factory.deploy();
  await contract.deployed();

  console.log("Contract deployed at:", contract.address);
};

deploy().catch((error) => {
  console.error("Error deploying contract:", error);
});