import { ethers } from "hardhat";

async function main() {
    // Obtener el contrato
    const PYMToken = await ethers.getContractFactory("PYMToken");
    
    // Desplegar el contrato
    console.log("Deploying PYMToken...");
    const pymToken = await PYMToken.deploy();
    await pymToken.waitForDeployment();

    console.log(`PYMToken deployed to: ${await pymToken.getAddress()}`);
}

// Llamar a main() y manejar errores
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
