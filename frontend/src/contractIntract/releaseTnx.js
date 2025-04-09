import { ethers } from 'ethers';
import { getContract } from '../utils/utils';

async function releaseTransaction(transactionId) {
  try {
    const contract = await getContract();
    const transactionIdBytes32 = ethers.encodeBytes32String(transactionId);
    const tx = await contract.releaseTransaction(transactionIdBytes32);
    await tx.wait();
    alert('Transaction Released');
  } catch (error) {
    alert(error.reason);
  }
}
export { releaseTransaction };
