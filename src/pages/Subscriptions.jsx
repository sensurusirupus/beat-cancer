import React, { useState, useEffect } from 'react';
import { useStateContext } from '../context';
import { fetchLatestPrice, connectWallet } from '../utils/contractInteraction';
import { ethers } from 'ethers';

const Subscriptions = () => {
  const { 
    subscriptions, 
    fetchUserSubscriptions, 
    createSubscription, 
    currentUser, 
    createSubscriptionTransaction 
  } = useStateContext();
  const [ethPrice, setEthPrice] = useState(0);
  const [newSubscription, setNewSubscription] = useState({
    planName: '',
    price: '',
    currency: 'ETH',
    startDate: '',
    endDate: '',
  });

  const predefinedPlans = [
    { name: 'Basic Plan', price: 0.1, duration: '1 Month' },
    { name: 'Standard Plan', price: 0.25, duration: '3 Months' },
    { name: 'Premium Plan', price: 0.5, duration: '6 Months' },
  ];

  useEffect(() => {
    if (currentUser) {
      fetchUserSubscriptions(currentUser.id);
    }
    fetchEthPrice();
  }, [fetchUserSubscriptions, currentUser]);

  const fetchEthPrice = async () => {
    try {
      const price = await fetchLatestPrice();
      console.log("Fetched ETH price:", price);
      setEthPrice(parseFloat(price));
    } catch (error) {
      console.error("Error fetching ETH price:", error);
      setEthPrice(0);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSubscription(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentUser) {
      await createSubscription({ 
        ...newSubscription, 
        userId: currentUser.id,
        price: parseFloat(newSubscription.price)
      });
      setNewSubscription({
        planName: '',
        price: '',
        currency: 'ETH',
        startDate: '',
        endDate: '',
      });
    }
  };

  const handleSubscribe = async (plan) => {
    try {
      if (!currentUser) {
        alert("Please log in to subscribe to a plan.");
        return;
      }

      const address = await connectWallet();
      console.log(`Subscribing to ${plan.name}`);
      
      // Request payment using MetaMask
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      // Convert ETH to Wei
      const weiAmount = ethers.utils.parseEther(plan.price.toString());
      
      // Send transaction
      const tx = await signer.sendTransaction({
        to: address, // You should replace this with your contract address or a designated wallet
        value: weiAmount
      });
      
      // Wait for transaction to be mined
      await tx.wait();
      
      console.log("Payment successful:", tx.hash);

      const startDate = new Date();
      const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

      const newSubscription = await createSubscription({
        userId: currentUser.id,
        planName: plan.name,
        price: plan.price,
        currency: 'ETH',
        startDate: startDate,
        endDate: endDate,
      });

      // Create a subscription transaction record
      await createSubscriptionTransaction({
        subscriptionId: newSubscription.id,
        amountPaid: plan.price,
        paidCurrency: 'ETH',
        conversionRate: ethPrice,
        usdEquivalent: plan.price * ethPrice,
        transactionHash: tx.hash,
      });

      alert(`Subscribed to ${plan.name} successfully!`);
      fetchUserSubscriptions(currentUser.id); // Refresh the subscriptions list
    } catch (error) {
      console.error("Error subscribing to plan:", error);
      alert("Failed to subscribe. Please try again.");
    }
  };

  return (
    <div className="flex flex-col p-4 text-white">
      <h1 className="text-3xl font-bold mb-6">Subscriptions</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {predefinedPlans.map((plan, index) => (
          <div key={index} className="bg-[#1c1c24] p-4 rounded-lg flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">{plan.name}</h2>
              <p className="text-[#1dc071] mb-2">{plan.price} ETH</p>
              <p className="mb-2">≈ ${(plan.price * ethPrice).toFixed(2)} USD</p>
              <p className="mb-2">Duration: {plan.duration}</p>
            </div>
            <button 
              onClick={() => handleSubscribe(plan)}
              className="mt-4 bg-[#1dc071] text-white p-2 rounded hover:bg-[#1ab069] transition-colors"
            >
              Subscribe
            </button>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold mb-4">Your Subscriptions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subscriptions.map(subscription => (
          <div key={subscription.id} className="bg-[#1c1c24] p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-2">{subscription.planName}</h2>
            <p className="text-[#1dc071] mb-2">{subscription.price} {subscription.currency}</p>
            <p className="mb-2">≈ ${(parseFloat(subscription.price) * ethPrice).toFixed(2)} USD</p>
            <p className="mb-2">Start Date: {new Date(subscription.startDate).toLocaleDateString()}</p>
            <p className="mb-2">End Date: {new Date(subscription.endDate).toLocaleDateString()}</p>
            <p className="mb-2">Status: <span className={`capitalize ${subscription.status === 'active' ? 'text-green-500' : 'text-red-500'}`}>{subscription.status}</span></p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Subscriptions;