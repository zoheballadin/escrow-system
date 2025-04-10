'use client';
import { useState } from 'react';
import { createTransaction } from '../../contractIntract/createTransaction';
import { releaseTransaction } from '../../contractIntract/releaseTnx';
import { getTransactionStatus } from '../../contractIntract/getTransactionStatus';
import TopBar from '@/components/TopBar';

const BuyerPage = () => {
  const [activeTab, setActiveTab] = useState('create'); // 'create', 'signature', 'lock', 'release', 'dispute', 'status'
  const [transactionId, setTransactionId] = useState('');
  const [sellerAddress, setSellerAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (action) => {
    if (action === 'create') {
      try {
        const randomString = generateRandomNumericString();
        setLoading(true);
        await createTransaction(randomString, sellerAddress, amount);
        setLoading(false);
        setTransactionId(randomString);
        const data = await getTransactionStatus(transactionId);
        setStatus(data);
      } catch (error) {
        console.error(error);
      }
    }

    if (action === 'release') {
      try {
        setLoading(true);
        await releaseTransaction(transactionId);
        const data = await getTransactionStatus(transactionId);
        setLoading(false);
        setStatus(data);
      } catch (error) {
        console.error(error);
      }
    }

    if (action === 'status') {
      try {
        setLoading(true);
        const data = await getTransactionStatus(transactionId);
        setLoading(false);
        setStatus(data);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 ">
      <TopBar />
      <div className="py-10 px-4">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Tab Navigation */}
          <div className="bg-gray-200">
            <nav className="flex flex-wrap">
              {[
                { key: 'create', label: 'Create Transaction' },
                { key: 'release', label: 'Release Transaction' },
                { key: 'status', label: 'Transaction Status' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 py-4 text-center text-sm font-medium transition-colors duration-200 focus:outline-none ${
                    activeTab === tab.key
                      ? 'bg-white border-b-4 border-blue-500 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'create' && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">
                  Create Transaction
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  <input
                    type="text"
                    placeholder="Receiver Address"
                    value={sellerAddress}
                    onChange={(e) => setSellerAddress(e.target.value)}
                    className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <button
                  onClick={() => handleSubmit('create')}
                  className="mt-6 w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-200"
                >
                  {loading ? 'Loading...' : 'Submit'}
                </button>
              </div>
            )}

            {activeTab === 'release' && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">
                  Release Transaction
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  <input
                    type="text"
                    placeholder="Transaction ID"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <button
                  onClick={() => handleSubmit('release')}
                  className="mt-6 w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-200"
                >
                  {loading ? 'Loading...' : 'Submit'}
                </button>
              </div>
            )}

            {activeTab === 'status' && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">
                  Transaction Status
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  <input
                    type="text"
                    placeholder="Transaction ID"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <button
                  onClick={() => handleSubmit('status')}
                  className="mt-6 w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-200"
                >
                  {loading ? 'Loading...' : 'Submit'}
                </button>
              </div>
            )}
            {transactionId.length > 0 && (
              <p className="text-2xl mt-8"> Your txid is: {transactionId}</p>
            )}
            <p className="text-2xl mt-8">{status}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

function generateRandomNumericString() {
  // Pick a random length between 12 and 15 (inclusive)
  const len = Math.floor(Math.random() * 4) + 12;
  const min = Math.pow(10, len - 1); // Minimum number with "len" digits
  const max = Math.pow(10, len) - 1; // Maximum number with "len" digits
  // Generate a random integer in the range [min, max]
  const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
  return String(randomNum);
}

export default BuyerPage;
