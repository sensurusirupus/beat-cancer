import { SignProtocolClient, SpMode, EvmChains } from "@ethsign/sp-sdk";
import { privateKeyToAccount } from "viem/accounts";

const privateKey = "0xe229e040a5adcc3b7c701e6fb3c2fe8d9fc16a39462268aca2ac55b31d6c942b"; // Your private key
const client = new SignProtocolClient(SpMode.OnChain, {
  chain: EvmChains.baseSepolia,
  account: privateKeyToAccount(privateKey),
});

export const createSubscriptionSchemas = async () => {
  const subscriptionSchema = {
    name: "Subscription",
    data: [
      { name: "user", type: "address" },
      { name: "planName", type: "string" },
      { name: "price", type: "uint256" },
      { name: "currency", type: "string" },
      { name: "startDate", type: "uint256" },
      { name: "endDate", type: "uint256" },
      { name: "timestamp", type: "uint256" }
    ]
  };
  const subscriptionSchemaId = await client.createSchema(subscriptionSchema);

  const subscriptionTransactionSchema = {
    name: "Subscription Transaction",
    data: [
      { name: "user", type: "address" },
      { name: "subscriptionId", type: "uint256" },
      { name: "amountPaid", type: "uint256" },
      { name: "paidCurrency", type: "string" },
      { name: "conversionRate", type: "uint256" },
      { name: "usdEquivalent", type: "uint256" },
      { name: "transactionHash", type: "string" },
      { name: "timestamp", type: "uint256" }
    ]
  };
  const subscriptionTransactionSchemaId = await client.createSchema(subscriptionTransactionSchema);

  return {
    subscriptionSchemaId,
    subscriptionTransactionSchemaId
  };
};