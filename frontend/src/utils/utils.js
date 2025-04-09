import { BrowserProvider, ethers } from "ethers";
import EscrowContract from '../builds/compiledContract.json'
 // Replace with the path to your contract's JSON file
const contractAddress = "0xb31B2997FB64704D62bA491Bfb3829a52D221bB3"
async function getContract() {
  try {
    const provider = new BrowserProvider(window.ethereum)
    const accounts = await provider.send("eth_requestAccounts", []);
    //const balance = await provider.getBalance(accounts[0]);
    const signer = await provider.getSigner();
    const Contract = new ethers.Contract(contractAddress, EscrowContract.abi, signer);
    return Contract;
  } catch (error) {
    console.error('Error getting Contract:', error);
  }
}
export { getContract };