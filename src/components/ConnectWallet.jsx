import React, { useState, useEffect } from "react";
import { connectWallet } from "../utils/contractInteraction";

const ConnectWallet = () => {
  const [account, setAccount] = useState(null);

  const handleConnectWallet = async () => {
    try {
      const address = await connectWallet();
      setAccount(address);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    // Optionally, you can also clear the provider and signer if needed
    if (typeof window.ethereum !== "undefined") {
      window.ethereum.removeAllListeners("accountsChanged");
    }
  };

  useEffect(() => {
    const checkIfWalletIsConnected = async () => {
      if (typeof window.ethereum !== "undefined") {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      }
    };

    checkIfWalletIsConnected();

    // Listen for account changes
    if (typeof window.ethereum !== "undefined") {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
        }
      });
    }

    return () => {
      if (typeof window.ethereum !== "undefined") {
        window.ethereum.removeAllListeners("accountsChanged");
      }
    };
  }, []);

  return (
    <div>
      {account ? (
        <div>
          <p>Connected: {account}</p>
          <button onClick={disconnectWallet}>Disconnect</button>
        </div>
      ) : (
        <button onClick={handleConnectWallet}>Connect Wallet</button>
      )}
    </div>
  );
};

export default ConnectWallet;