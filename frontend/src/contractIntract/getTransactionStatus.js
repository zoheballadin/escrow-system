import { ethers } from 'ethers';
import { getContract } from '../utils/utils';

const transactionStatusMap = {
  0: 'Transaction Created',
  1: 'Funds Locked',
  2: 'Transaction Completed',
  3: 'Dispute Initiated',
  4: 'Dispute Resolved',
  5: 'Transaction Canceled',
};

async function getTransactionStatus(transactionId) {
  try {
    const contract = await getContract();
    const transactionIdBytes32 = ethers.encodeBytes32String(transactionId);
    const tx = await contract.getTransactionStatus(transactionIdBytes32);
    return 'Transaction Status: ' + transactionStatusMap[tx];
  } catch (error) {
    alert(error.reason);
  }
}
export { getTransactionStatus };
