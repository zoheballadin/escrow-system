'use client';
import React, { useState, useEffect } from 'react';
import { BrowserProvider } from 'ethers';

const TopBar = () => {
  // State variables for wallet address, ENS name, and avatar
  const [address, setAddress] = useState(null);
  const [ensName, setEnsName] = useState(null);
  const [avatar, setAvatar] = useState(null);

  // Helper: shorten the wallet address for display
  const shortenAddress = (addr) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '';

  // Provided method to fetch ENS data using ethers v6's BrowserProvider
  const fetchEnsData = async () => {
    try {
      const provider = new BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      setAddress(userAddress);
      console.log(userAddress);

      const name = await provider.lookupAddress(userAddress);
      if (name) {
        setEnsName(name);
        const avatarUrl = await provider.getAvatar(name);
        if (avatarUrl) setAvatar(avatarUrl);
      }
    } catch (err) {
      console.error('MetaMask connection failed:', err);
    }
  };

  // Connect wallet using the fetchEnsData method
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask!');
      return;
    }
    await fetchEnsData();
  };

  // Disconnect wallet by clearing the state
  const disconnectWallet = () => {
    setAddress(null);
    setEnsName(null);
    setAvatar(null);
  };

  // Set up event listeners for account and network changes
  useEffect(() => {
    window.ethereum.on('accountsChanged', () => fetchEnsData());
    window.ethereum.on('chainChanged', () => fetchEnsData());

    // Cleanup event listeners on component unmount
    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', () => fetchEnsData());
        window.ethereum.removeListener('chainChanged', () => fetchEnsData());
      }
    };
  }, []);

  useEffect(() => {
    fetchEnsData(); // Fetch ENS data on initial load
  }, []);

  return (
    <div className="bg-white shadow-md flex items-center justify-between px-6 py-4">
      {address ? (
        <>
          <div className="flex items-center space-x-3">
            {avatar ? (
              <img
                src={avatar}
                alt="ENS Avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-white">N/A</span>
              </div>
            )}
            <div>
              <p className="text-lg font-semibold text-gray-800">
                {ensName || 'MetaMask Wallet'}
              </p>
              <p className="text-sm text-gray-500">{shortenAddress(address)}</p>
            </div>
          </div>
        </>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default TopBar;
