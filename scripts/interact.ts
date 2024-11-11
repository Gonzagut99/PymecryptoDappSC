// scripts/interact.ts
import { ethers } from "hardhat";
import { PYMToken } from "../typechain-types";

async function main() {
    // Obtener el contrato desplegado
    const PYMToken = await ethers.getContractFactory("PYMToken");
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    let pymToken:PYMToken
    
    pymToken = PYMToken.attach(contractAddress) as PYMToken;

    // Obtener cuentas
    const [owner, addr1, addr2, addr3] = await ethers.getSigners();

    // 1. Transferir tokens para poder crear propuesta
    const proposalAmount = ethers.parseEther("1000");
    console.log("Transfiriendo tokens para propuesta...");
    await pymToken.transfer(addr1.address, proposalAmount);

    // 2. Crear propuesta
    console.log("Creando propuesta...");
    await pymToken.connect(addr1).createProposal("Test Propuesta Certus #1");

    // 3. Transferir tokens para votar
    console.log("Transfiriendo tokens para votar...");
    await pymToken.transfer(addr2.address, ethers.parseEther("2000"));
    await pymToken.transfer(addr3.address, ethers.parseEther("1000"));

    // 4. Votar en la propuesta
    console.log("Votando en la propuesta...");
    await pymToken.connect(addr2).vote(0, 1);
    //vote against
    await pymToken.connect(addr3).vote(0, 0);

    // 5. Verificar resultados
    const proposal = await pymToken.proposals(0);
    console.log("Resultados de la propuesta:", {
        votesFor: proposal.votesFor,
        votesAgainst: proposal.votesAgainst
    });

    // 6. Delegar votos
    const delegationAmount = ethers.parseEther("1000");
    console.log("Delegando votos...");
    await pymToken.transfer(addr1.address, delegationAmount);
    await pymToken.connect(addr1).delegateVote(addr2.address);

    // 7. Verificar votos delegados
    const delegatedVotes = await pymToken.delegatedVotes(addr2.address);
    console.log("Votos delegados:", delegatedVotes.toString());
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });