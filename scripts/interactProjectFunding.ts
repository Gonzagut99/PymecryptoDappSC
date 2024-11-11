import { ethers } from "hardhat";
import { ProjectFunding, PYMToken } from "../typechain-types";

async function main() {
    // Dirección del contrato desplegado en Sepolia
    const pymTokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const projectFundingAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

    // Obtener las instancias de los contratos
    const PYMToken = await ethers.getContractFactory("PYMToken");
    let pymToken: PYMToken
    pymToken = PYMToken.attach(pymTokenAddress) as PYMToken;

    const ProjectFunding = await ethers.getContractFactory("ProjectFunding");
    let projectFunding: ProjectFunding
    projectFunding = ProjectFunding.attach(projectFundingAddress) as ProjectFunding;

    // Obtener las cuentas
    const [owner, addr1, addr2] = await ethers.getSigners();

    // 1. Transferir tokens a addr1 para que pueda crear un proyecto
    console.log("Transfiriendo tokens a addr1...");
    const minPymForProjectCreation = ethers.parseEther("10");
    await pymToken.transfer(addr1.address, minPymForProjectCreation);

    // 2. Crear un proyecto
    console.log("Creando proyecto...");
    await pymToken.connect(addr1).approve(await projectFunding.getAddress(), minPymForProjectCreation);
    await projectFunding.connect(addr1).createProject("Proyecto 1", addr1.address, ethers.parseEther("100"));

    // 3. Transferir tokens a addr2 para financiar el proyecto
    console.log("Transfiriendo tokens a addr2...");
    const fundAmount = ethers.parseEther("50");
    await pymToken.transfer(addr2.address, fundAmount);

    // 4. Financiar el proyecto
    console.log("Financiando proyecto...");
    await pymToken.connect(addr2).approve(await projectFunding.getAddress(), fundAmount);
    await projectFunding.connect(addr2).fundProjectWithPYM(0, fundAmount);

    // 5. Verificar resultados
    const project = await projectFunding.projects(0);
    console.log("Resultados del proyecto:", {
        name: project.name,
        recipient: project.recipient,
        fundingGoal: ethers.formatEther(project.fundingGoal),
        fundsRaised: ethers.formatEther(project.fundsRaised),
        funded: project.funded
    });
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});