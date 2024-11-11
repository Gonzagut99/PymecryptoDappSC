import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { PYMToken } from "../typechain-types";

describe("PYMToken", function () {
  let pymToken: PYMToken;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  let addr3: SignerWithAddress;

  const ONE_WEEK = 7n * 24n * 60n * 60n;
  const MIN_TOKENS_FOR_PROPOSAL = ethers.parseEther("1000");

  beforeEach(async function () {
    [owner, addr1, addr2, addr3] = await ethers.getSigners();
    const PYMToken = await ethers.getContractFactory("PYMToken");
    pymToken = await PYMToken.deploy();
    await pymToken.waitForDeployment();
  });

  describe("Distribución Inicial", () => {
    it("Debería tener la distribución inicial correcta", async function () {
      const totalSupply = await pymToken.INITIAL_SUPPLY();
      const ownerBalance = await pymToken.balanceOf(owner.address);
      const contractAddress = await pymToken.getAddress();
      const contractBalance = await pymToken.balanceOf(contractAddress);
      // expect(await pymToken.balanceOf(owner.address)).to.equal((Number(totalSupply)*70)/100);
      // expect(await pymToken.balanceOf(await pymToken.getAddress())).to.equal((Number(totalSupply)*30)/(100));
      expect(ownerBalance).to.equal((totalSupply * 70n) / 100n);
      expect(contractBalance).to.equal((totalSupply * 30n) / 100n);
    });
  });

  describe("Funciones de Administrador", () => {
    it("Debería permitir al owner acuñar tokens", async function () {
      const mintAmount = ethers.parseEther("1000");
      await pymToken.mint(addr1.address, mintAmount);
      expect(await pymToken.balanceOf(addr1.address)).to.equal(mintAmount);
    });

    it("Debería permitir al owner quemar sus tokens", async function () {
      const burnAmount = ethers.parseEther("1000");
      const initialBalance = await pymToken.balanceOf(owner.address);
      await pymToken.burn(burnAmount);
      expect(await pymToken.balanceOf(owner.address)).to.equal(
        initialBalance - burnAmount
      );
    });
  });

  describe("Gobernanza", () => {
    beforeEach(async function () {
      await pymToken.transfer(addr1.address, MIN_TOKENS_FOR_PROPOSAL);
    });

    it("Debería crear una propuesta correctamente", async function () {
      await pymToken.connect(addr1).createProposal("Test Proposal");
      const proposal = await pymToken.proposals(0);
      expect(proposal.description).to.equal("Test Proposal");
      expect(proposal.executed).to.be.false;
    });

    it("Debería permitir votar en una propuesta", async function () {
      await pymToken.connect(addr1).createProposal("Test Proposal");
      await pymToken.transfer(addr2.address, ethers.parseEther("2000"));
      await pymToken.connect(addr2).vote(0, 1);

      const proposal = await pymToken.proposals(0);
      expect(proposal.votesFor).to.be.gt(0);
      expect(await pymToken.hasVoted(0, addr2.address)).to.be.true;
    });

    it("Debería permitir delegar votos", async function () {
      const delegationAmount = ethers.parseEther("1000");

      // Transferir tokens exactos para la delegación
      await pymToken.transfer(addr1.address, delegationAmount);

      // Verificar balance antes de delegar
      const initialBalance = await pymToken.balanceOf(addr1.address);

      // Realizar la delegación
      await pymToken.connect(addr1).delegateVote(addr2.address);

      // Verificar delegatedVotes
      const delegatedVotes = await pymToken.delegatedVotes(addr2.address);
      expect(delegatedVotes).to.equal(initialBalance);
    });
  });

  describe("Distribución de Recompensas", () => {
    it("Debería distribuir recompensas correctamente", async function () {
      const amounts = [ethers.parseEther("100"), ethers.parseEther("200")];
      const recipients = [addr1.address, addr2.address];

      await pymToken.distributeRewards(recipients, amounts);

      expect(await pymToken.balanceOf(addr1.address)).to.equal(amounts[0]);
      expect(await pymToken.balanceOf(addr2.address)).to.equal(amounts[1]);
    });
  });
});
