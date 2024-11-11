// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./PYMGovernanceToken.sol";

contract ProjectFunding is Ownable {
    PYMToken public pymToken;
    uint256 public projectCount = 0;
    //Necesita al menos 500 soles en PYM para poder levantar un proyecto (10PYM = 47,68 soles*10)
    uint256 public constant MIN_PYM_FOR_PROJECT_CREATION = 10 * 10 ** 18; // 1 PYM token 1PYM = 0.004 ETH = 47,68 PEN

    struct Project {
        uint256 id;
        string name;
        address payable recipient;
        uint256 fundingGoal;
        uint256 fundsRaised;
        bool funded;
    }

    mapping(uint256 => Project) public projects;

    event ProjectCreated(uint256 id, string name, address recipient, uint256 fundingGoal);
    event ProjectFunded(uint256 id, uint256 amount);

    constructor(address _pymTokenAddress) Ownable(msg.sender) {
        pymToken = PYMToken(_pymTokenAddress);
    }

    function createProject(string memory name, address payable recipient, uint256 fundingGoal) external {
        require(pymToken.balanceOf(msg.sender) >= MIN_PYM_FOR_PROJECT_CREATION, "No tiene suficientes tokens PYM para crear un proyecto");

        projects[projectCount] = Project({
            id: projectCount,
            name: name,
            recipient: recipient,
            fundingGoal: fundingGoal,
            fundsRaised: 0,
            funded: false
        });

        emit ProjectCreated(projectCount, name, recipient, fundingGoal);
        projectCount++;
    }

    function fundProjectWithPYM(uint256 projectId, uint256 amount) external {
        Project storage project = projects[projectId];
        require(!project.funded, "El proyecto ya ha sido financiado");
        require(project.fundsRaised + amount <= project.fundingGoal, "El monto excede la meta de financiamiento");

        pymToken.transferFrom(msg.sender, address(this), amount);
        project.fundsRaised += amount;
        pymToken.transfer(project.recipient, amount);

        if (project.fundsRaised >= project.fundingGoal) {
            project.funded = true;
        }

        emit ProjectFunded(projectId, amount);
    }
}