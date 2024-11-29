import { ethers } from "hardhat";

async function main() {

    const pymTokenAddress = "0xB4461D1fA73e340846D0aE973C9E06c062b31925"; // Upadte every time you deploy the contract

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
