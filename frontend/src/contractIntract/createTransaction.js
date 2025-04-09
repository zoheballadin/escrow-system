import { ethers } from 'ethers';
import { getContract } from '../utils/utils';

async function createTransaction(transactionId, sellerAddress, amount) {
  console.log(amount);
  try {
    const contract = await getContract();
    const transactionIdBytes32 = ethers.encodeBytes32String(transactionId);
    const tx = await contract.createTransaction(
      transactionIdBytes32,
      sellerAddress,

      { value: ethers.parseEther(amount) }
    );
    await tx.wait();
    alert('Transaction created');
  } catch (error) {
    alert(error.reason);
  }
}

export { createTransaction };
