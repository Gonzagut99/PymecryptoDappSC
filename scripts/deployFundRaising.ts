import { ethers } from "hardhat";

async function main() {

    const pymTokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Upadte every time you deploy the contract

    const ProjectFunding = await ethers.getContractFactory("ProjectFunding");
    const projectFunding = await ProjectFunding.deploy(pymTokenAddress);
    await projectFunding.waitForDeployment();
    console.log("ProjectFunding deployed to:", await projectFunding.getAddress());
}

// Llamar a main() y manejar errores
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
