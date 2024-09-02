// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.8/KeeperCompatible.sol";

contract MedicalTreatmentPlan is VRFConsumerBase, KeeperCompatibleInterface {
    // Chainlink VRF variables
    bytes32 internal keyHash;
    uint256 internal fee;
    uint256 public randomResult;

    // Chainlink Price Feed variables
    AggregatorV3Interface internal priceFeed;

    // Chainlink Automation variables
    uint256 public lastCheckTime;
    uint256 public interval;

    // Medical treatment plan variables
    struct TreatmentPlan {
        address patient;
        address medicalProfessional;
        string description;
        uint256 startTime;
        uint256 endTime;
    }

    TreatmentPlan[] public treatmentPlans;
    address[] public medicalProfessionals;

    // Medical service pricing
    int256 public latestPrice;

    // Events
    event TreatmentPlanCreated(address patient, address medicalProfessional, string description, uint256 startTime, uint256 endTime);
    event RandomnessRequested(bytes32 requestId);
    event MedicalProfessionalAssigned(address medicalProfessional);
    event PriceUpdated(int256 price);
    event ReminderSent(address patient, string message);

    /**
     * @dev Constructor initializes the contract with Chainlink configurations.
     * @param _vrfCoordinator The address of the Chainlink VRF Coordinator.
     * @param _linkToken The address of the LINK token.
     * @param _keyHash The key hash for the Chainlink VRF.
     * @param _fee The fee for the Chainlink VRF request.
     * @param _priceFeed The address of the Chainlink Price Feed.
     * @param _interval The interval for Chainlink Automation.
     */
    constructor(
        address _vrfCoordinator,
        address _linkToken,
        bytes32 _keyHash,
        uint256 _fee,
        address _priceFeed,
        uint256 _interval
    ) VRFConsumerBase(_vrfCoordinator, _linkToken) {
        keyHash = _keyHash;
        fee = _fee;
        priceFeed = AggregatorV3Interface(_priceFeed);
        interval = _interval;
        lastCheckTime = block.timestamp;
    }

    /**
     * @dev Allows patients to create a treatment plan.
     * @param description The description of the treatment plan.
     * @param startTime The start time of the treatment plan.
     * @param endTime The end time of the treatment plan.
     */
    function createTreatmentPlan(string memory description, uint256 startTime, uint256 endTime) public {
        require(startTime < endTime, "Start time must be before end time");
        treatmentPlans.push(TreatmentPlan({
            patient: msg.sender,
            medicalProfessional: address(0),
            description: description,
            startTime: startTime,
            endTime: endTime
        }));
        requestRandomMedicalProfessional();
    }

    /**
     * @dev Requests randomness from Chainlink VRF to assign a random medical professional.
     * @return requestId The ID of the randomness request.
     */
    function requestRandomMedicalProfessional() internal returns (bytes32 requestId) {
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK");
        requestId = requestRandomness(keyHash, fee);
        emit RandomnessRequested(requestId);
    }

    /**
     * @dev Callback function used by VRF Coordinator to return the randomness.
     * @param requestId The ID of the randomness request.
     * @param randomness The random number generated.
     */
    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        randomResult = randomness;
        uint256 professionalIndex = randomness % medicalProfessionals.length;
        address assignedProfessional = medicalProfessionals[professionalIndex];
        treatmentPlans[treatmentPlans.length - 1].medicalProfessional = assignedProfessional;
        emit MedicalProfessionalAssigned(assignedProfessional);
    }

    /**
     * @dev Fetches the latest price of medical services from Chainlink Price Feed.
     */
    function updatePrice() public {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        latestPrice = price;
        emit PriceUpdated(price);
    }

    /**
     * @dev Checks if upkeep is needed for Chainlink Automation.
     * @param checkData The data passed to the checkUpkeep function.
     * @return upkeepNeeded Boolean indicating if upkeep is needed.
     * @return performData The data to be passed to the performUpkeep function.
     */
    function checkUpkeep(bytes calldata checkData) external view override returns (bool upkeepNeeded, bytes memory performData) {
        upkeepNeeded = (block.timestamp - lastCheckTime) > interval;
        performData = checkData;
    }

    /**
     * @dev Performs upkeep for Chainlink Automation.
     * @param performData The data passed from the checkUpkeep function.
     */
    function performUpkeep(bytes calldata performData) external override {
        if ((block.timestamp - lastCheckTime) > interval) {
            lastCheckTime = block.timestamp;
            // Send reminders to all patients
            for (uint256 i = 0; i < treatmentPlans.length; i++) {
                if (block.timestamp >= treatmentPlans[i].startTime && block.timestamp <= treatmentPlans[i].endTime) {
                    emit ReminderSent(treatmentPlans[i].patient, "Time for your treatment!");
                }
            }
        }
    }

    /**
     * @dev Adds a medical professional to the list of available professionals.
     * @param professional The address of the medical professional.
     */
    function addMedicalProfessional(address professional) public {
        medicalProfessionals.push(professional);
    }
}