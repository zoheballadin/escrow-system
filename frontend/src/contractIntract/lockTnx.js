import { ethers } from 'ethers';
import { getContract } from '../utils/utils';

async function lockTransaction(transactionId, disputeDuration) {
  try {
    const contract = await getContract();
    const transactionIdBytes32 = ethers.encodeBytes32String(transactionId);
    const tx = await contract.lockTransaction(
      transactionIdBytes32,
      disputeDuration
    );
    await tx.wait();
    alert('Transaction Locked');
  } catch (error) {
    alert(error.reason);
  }
}
export { lockTransaction };
