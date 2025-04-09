'use client';
import { useState } from 'react';
import { addSignature } from '../../contractIntract/addSign';
import { getTransactionStatus } from '../../contractIntract/getTransactionStatus';
import TopBar from '@/components/TopBar';

export default function SellerPage() {
  // Control active tab: 'signature' or 'status'
  const [activeTab, setActiveTab] = useState('signature');
  const [transactionId, setTransactionId] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (action) => {
    if (action === 'signature') {
      try {
        setLoading(true);
        await addSignature(transactionId);
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
    <div className="min-h-screen bg-gray-100">
      <TopBar />
      <div className="py-10 px-4">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Tab Navigation */}
          <div className="bg-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('signature')}
                className={`flex-1 py-4 text-center text-sm font-medium transition-colors duration-200 focus:outline-none ${
                  activeTab === 'signature'
                    ? 'bg-white border-b-4 border-blue-500 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-300'
                }`}
              >
                Confirm Escrow
              </button>
              <button
                onClick={() => setActiveTab('status')}
                className={`flex-1 py-4 text-center text-sm font-medium transition-colors duration-200 focus:outline-none ${
                  activeTab === 'status'
                    ? 'bg-white border-b-4 border-blue-500 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-300'
                }`}
              >
                Transaction Status
              </button>
            </nav>
          </div>
          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'signature' && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">
                  Accept an escrow payment
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
                  onClick={() => handleSubmit('signature')}
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

            <p className="text-2xl mt-8">{status}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
