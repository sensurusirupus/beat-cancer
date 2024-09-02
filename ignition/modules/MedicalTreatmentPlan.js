const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("MedicalTreatmentPlanModule", (m) => {
  const vrfCoordinator = m.getParameter("vrfCoordinator", "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625"); // VRF Coordinator address for Sepolia
  const linkToken = m.getParameter("linkToken", "0x514910771AF9Ca656af840dff83E8264EcF986CA"); // LINK token address for Sepolia
  const keyHash = m.getParameter("keyHash", "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c"); // gas lane (keyHash) for Sepolia
  const fee = m.getParameter("fee", "100000000000000000"); // 0.1 LINK as a string
  const priceFeed = m.getParameter("priceFeed", "0x694AA1769357215DE4FAC081bf1f309aDC325306"); // ETH/USD price feed address for Sepolia
  const interval = m.getParameter("interval", 86400); // 1 day in seconds

  const medicalTreatmentPlan = m.contract("MedicalTreatmentPlan", [
    vrfCoordinator,
    linkToken,
    keyHash,
    fee,
    priceFeed,
    interval,
  ]);

  return { medicalTreatmentPlan };
});