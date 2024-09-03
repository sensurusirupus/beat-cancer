import { SignProtocolClient, SpMode, EvmChains } from "@ethsign/sp-sdk";
import { privateKeyToAccount } from "viem/accounts";

const privateKey = "0xe229e040a5adcc3b7c701e6fb3c2fe8d9fc16a39462268aca2ac55b31d6c942b"; // Your private key
const client = new SignProtocolClient(SpMode.OnChain, {
  chain: EvmChains.baseSepolia,
  account: privateKeyToAccount(privateKey),
});

export const createSubscriptionAttestation = async (user, planName, price, currency, startDate, endDate) => {
  const subscriptionSchemaId = "0x8a"; 
  const attestation = {
    schemaId: subscriptionSchemaId,
    data: {
      user,
      planName,
      price,
      currency,
      startDate: Math.floor(startDate.getTime() / 1000),
      endDate: Math.floor(endDate.getTime() / 1000),
      timestamp: Math.floor(Date.now() / 1000)
    },
    indexingValue: user
  };
  try {
    const result = await client.createAttestation(attestation);
    console.log("Subscription attestation created:", result);
    return result;
  } catch (error) {
    console.error("Error creating subscription attestation:", error);
    return null;
  }
};

export const createSubscriptionTransactionAttestation = async (user, subscriptionId, amountPaid, paidCurrency, conversionRate, usdEquivalent, transactionHash) => {
  const subscriptionTransactionSchemaId = "0x9b"; // Replace with your actual schema ID
  const attestation = {
    schemaId: subscriptionTransactionSchemaId,
    data: {
      user,
      subscriptionId,
      amountPaid,
      paidCurrency,
      conversionRate,
      usdEquivalent,
      transactionHash,
      timestamp: Math.floor(Date.now() / 1000)
    },
    indexingValue: user
  };
  try {
    const result = await client.createAttestation(attestation);
    console.log("Subscription transaction attestation created:", result);
    return result;
  } catch (error) {
    console.error("Error creating subscription transaction attestation:", error);
    return null;
  }
};