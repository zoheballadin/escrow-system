import { BrowserProvider, ethers } from 'ethers';
import contractAddress from '../contracts/EscrowContract-address.json';
import EscrowAbi from '../contracts/EscrowContract-abi.json';
// Replace with the path to your contract's JSON file

async function getContract() {
  try {
    const provider = new BrowserProvider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    //const balance = await provider.getBalance(accounts[0]);
    const signer = await provider.getSigner();
    const contractABI = Array.isArray(EscrowAbi) ? EscrowAbi : EscrowAbi.abi;
    const Contract = new ethers.Contract(
      contractAddress.address,
      contractABI,
      signer
    );
    return Contract;
  } catch (error) {
    console.error('Error getting Contract:', error);
  }
}
export { getContract };
