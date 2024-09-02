import { ethers } from "ethers";
import MedicalTreatmentPlanABI from "./MedicalTreatmentPlan.json"; // Import the ABI of the contract

// Define the contract address (replace with your deployed contract address)
const contractAddress = "0xD9277DD8c9AB180338B81d472F62A4a70Ddde5fa";

// Function to get the provider
const getProvider = () => {
  if (window.ethereum) {
    return new ethers.providers.Web3Provider(window.ethereum);
  } else {
    console.error("No Ethereum provider found. Install MetaMask.");
    return null;
  }
};

// Function to get the signer
const getSigner = (provider) => {
  return provider.getSigner();
};

// Function to get the contract instance
const getContract = (signer) => {
  return new ethers.Contract(contractAddress, MedicalTreatmentPlanABI.abi, signer);
};

// Function to connect wallet
export const connectWallet = async () => {
  if (typeof window.ethereum !== "undefined") {
    try {
      // Request account access
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      return address;
    } catch (error) {
      console.error("Error connecting wallet:", error);
      throw new Error("Failed to connect wallet");
    }
  } else {
    throw new Error("Please install MetaMask!");
  }
};

// Function to create a treatment plan
export const createTreatmentPlan = async (description, startTime, endTime) => {
  const provider = getProvider();
  if (!provider) return;

  const signer = getSigner(provider);
  const contract = getContract(signer);

  try {
    const tx = await contract.createTreatmentPlan(description, startTime, endTime);
    await tx.wait();
    console.log("Treatment plan created successfully");
  } catch (error) {
    console.error("Error creating treatment plan:", error);
  }
};

// Function to add a medical professional
export const addMedicalProfessional = async (professionalAddress) => {
  const provider = getProvider();
  if (!provider) throw new Error("No Ethereum provider found. Install MetaMask.");

  const signer = getSigner(provider);
  const contract = getContract(signer);

  try {
    const tx = await contract.addMedicalProfessional(professionalAddress);
    await tx.wait();
    console.log("Medical professional added successfully");
  } catch (error) {
    console.error("Error adding medical professional:", error);
    throw error;
  }
};

// New function to fetch ETH price from CoinGecko API
export const fetchLatestPrice = async () => {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
    const data = await response.json();
    const ethPrice = data.ethereum.usd;
    console.log("Latest ETH price:", ethPrice);
    return ethPrice.toString();
  } catch (error) {
    console.error("Error fetching ETH price from CoinGecko:", error);
    return "0";
  }
};

// Function to get all treatment plans
export const getTreatmentPlans = async () => {
  const provider = getProvider();
  if (!provider) return;

  const signer = getSigner(provider);
  const contract = getContract(signer);

  try {
    const treatmentPlans = await contract.treatmentPlans();
    console.log("Treatment plans:", treatmentPlans);
    return treatmentPlans;
  } catch (error) {
    console.error("Error fetching treatment plans:", error);
  }
};

// Function to get a specific treatment plan by index
export const getTreatmentPlan = async (index) => {
  const provider = getProvider();
  if (!provider) return;

  const signer = getSigner(provider);
  const contract = getContract(signer);

  try {
    const treatmentPlan = await contract.treatmentPlans(index);
    console.log("Treatment plan:", treatmentPlan);
    return treatmentPlan;
  } catch (error) {
    console.error("Error fetching treatment plan:", error);
  }
};

// Function to get all medical professionals
export const getMedicalProfessionals = async () => {
  const provider = getProvider();
  if (!provider) return;

  const signer = getSigner(provider);
  const contract = getContract(signer);

  try {
    const medicalProfessionals = await contract.medicalProfessionals();
    console.log("Medical professionals:", medicalProfessionals);
    return medicalProfessionals;
  } catch (error) {
    console.error("Error fetching medical professionals:", error);
  }
};