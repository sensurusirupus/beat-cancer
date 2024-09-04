# BeatCancer

BeatCancer is an innovative blockchain-based platform designed to revolutionize cancer treatment management. By leveraging cutting-edge technologies such as AI, blockchain, and decentralized identity, BeatCancer aims to provide a secure, transparent, and efficient system for patients, medical professionals, and researchers.

## Features

- AI-driven personalized treatment plans
- Blockchain-based secure medical records
- Decentralized authentication with Web3Auth
- Smart contract integration for treatment plan management
- Real-time ETH/USD price feed using Chainlink oracles
- Subscription management with on-chain attestations
- Interactive Kanban board for treatment progress tracking

## Technologies Used

- React.js for the frontend
- Ethereum blockchain (Sepolia testnet)
- Hardhat for smart contract development and deployment
- Chainlink for VRF, Price Feeds, and Automation
- Web3Auth for decentralized authentication
- Sign Protocol for creating verifiable attestations
- Google's Generative AI (Gemini) for AI-driven analysis
- Neon Database for serverless data storage
- Drizzle ORM for database management

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- MetaMask browser extension

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/beatcancer.git
   cd beatcancer
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:
   ```
   REACT_APP_INFURA_PROJECT_ID=your_infura_project_id
   REACT_APP_WEB3AUTH_CLIENT_ID=your_web3auth_client_id
   REACT_APP_GEMINI_API_KEY=your_gemini_api_key
   ```

4. Start the development server:
   ```
   npm start
   ```

## Smart Contract Deployment

The MedicalTreatmentPlan smart contract is deployed using Hardhat and Ignition. To deploy the contract to the Sepolia testnet:

```
npx hardhat ignition deploy ./ignition/modules/MedicalTreatmentPlan.js --network sepolia
```

## Key Components

### AI-Driven Analysis
The project uses Google's Generative AI (Gemini) to analyze medical reports and generate personalized treatment plans. This can be seen in:


```61:82:src/pages/records/single-record-details.jsx
    const genAI = new GoogleGenerativeAI('AIzaSyDG8G0kT3XXyGjYYokGsb55FYsIgUsoC2s');

    try {
      const base64Data = await readFileAsBase64(file);

      const imageParts = [
        {
          inlineData: {
            data: base64Data,
            mimeType: filetype,
          },
        },
      ];

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      const prompt = `You are an expert cancer and any disease diagnosis analyst. Use your knowledge base to answer questions about giving personalized recommended treatments.
        give a detailed treatment plan for me, make it more readable, clear and easy to understand make it paragraphs to make it more readable
        `;

      const result = await model.generateContent([prompt, ...imageParts]);
      const response = await result.response;
```


### Decentralized Authentication
Web3Auth is integrated for secure and user-friendly authentication:


```8:34:src/components/Navbar.jsx
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";

const clientId = "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ";

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0xaa36a7",
  rpcTarget: "https://rpc.ankr.com/eth_sepolia",
  displayName: "Ethereum Sepolia Testnet",
  blockExplorerUrl: "https://sepolia.etherscan.io",
  ticker: "ETH",
  tickerName: "Ethereum",
  logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});

const web3auth = new Web3Auth({
  clientId,
  chainConfig,
  web3AuthNetwork: WEB3AUTH_NETWORK.TESTNET,
  privateKeyProvider
});
```


### On-Chain Attestations
Sign Protocol is used to create verifiable attestations for subscriptions and transactions:


```10:59:src/utils/signattestation.js
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
```


## Contributing

We welcome contributions to the BeatCancer project. Please read our CONTRIBUTING.md file for guidelines on how to make contributions.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.

## Acknowledgments

- Chainlink for providing decentralized oracle services
- Web3Auth for simplifying decentralized authentication
- Sign Protocol for enabling verifiable on-chain attestations
- The Ethereum community for continuous support and innovation

