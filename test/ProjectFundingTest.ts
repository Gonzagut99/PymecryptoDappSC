import { expect } from "chai";
import { ethers } from "hardhat";
import { PYMToken, ProjectFunding } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("ProjectFunding", function () {
  let pymToken: PYMToken;
  let projectFunding: ProjectFunding;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;

  const MIN_PYM_FOR_PROJECT_CREATION = ethers.parseEther("10"); // 10 PYM tokens
  const FUNDING_GOAL = ethers.parseEther("100"); // 100 PYM tokens

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    // Desplegar PYMToken
    const PYMToken = await ethers.getContractFactory("PYMToken");
    pymToken = (await PYMToken.deploy()) 
    await pymToken.waitForDeployment();

    // Desplegar ProjectFunding
    const ProjectFunding = await ethers.getContractFactory("ProjectFunding");
    projectFunding = (await ProjectFunding.deploy(await pymToken.getAddress()));
    await projectFunding.waitForDeployment();

    // Transferir tokens a addr1 para que pueda crear un proyecto
    await pymToken.transfer(addr1.address, MIN_PYM_FOR_PROJECT_CREATION);
  });

  describe("Creación de Proyectos", () => {
    it("Debería permitir crear un proyecto si tiene suficientes tokens PYM", async function () {
      await pymToken.connect(addr1).approve(await projectFunding.getAddress(), MIN_PYM_FOR_PROJECT_CREATION);

      await expect(projectFunding.connect(addr1).createProject("Proyecto 1", addr1.address, FUNDING_GOAL))
        .to.emit(projectFunding, "ProjectCreated")
        .withArgs(0, "Proyecto 1", addr1.address, FUNDING_GOAL);
    });

    it("Debería revertir si no tiene suficientes tokens PYM", async function () {
        // Verificar que addr2 no tiene tokens
      const balance = await pymToken.balanceOf(addr2.address);
      expect(balance).to.equal(0);
      // Intentar crear proyecto con addr2 que no tiene tokens
      await expect(projectFunding.connect(addr2).createProject("Proyecto 2", addr2.address, FUNDING_GOAL))
        .to.be.revertedWith("No tiene suficientes tokens PYM para crear un proyecto");
    });
  });

  describe("Financiamiento de Proyectos", () => {
    beforeEach(async function () {
      await pymToken.connect(addr1).approve(await projectFunding.getAddress(), MIN_PYM_FOR_PROJECT_CREATION);
      await projectFunding.connect(addr1).createProject("Proyecto 1", addr1.address, FUNDING_GOAL);
    });

    it("Debería permitir financiar un proyecto con PYM tokens", async function () {
      const fundAmount = ethers.parseEther("50"); // 50 PYM tokens
      await pymToken.transfer(addr2.address, fundAmount);
      await pymToken.connect(addr2).approve(await projectFunding.getAddress(), fundAmount);

      await expect(projectFunding.connect(addr2).fundProjectWithPYM(0, fundAmount))
        .to.emit(projectFunding, "ProjectFunded")
        .withArgs(0, fundAmount);

      const project = await projectFunding.projects(0);
      expect(project.fundsRaised).to.equal(fundAmount);
    });

    it("Debería revertir si el monto excede la meta de financiamiento", async function () {
      const fundAmount = ethers.parseEther("150"); // 150 PYM tokens
      await pymToken.transfer(addr2.address, fundAmount);
      await pymToken.connect(addr2).approve(projectFunding.getAddress(), fundAmount);

      await expect(projectFunding.connect(addr2).fundProjectWithPYM(0, fundAmount))
        .to.be.revertedWith("El monto excede la meta de financiamiento");
    });
  });

  // describe("Retiro de Fondos", () => {
  //   beforeEach(async function () {
  //     await pymToken.connect(addr1).approve(await projectFunding.getAddress(), MIN_PYM_FOR_PROJECT_CREATION);
  //     await projectFunding.connect(addr1).createProject("Proyecto 1", addr1.address, FUNDING_GOAL);
  //   });

  //   it("Debería permitir retirar fondos si el proyecto ha sido financiado", async function () {
  //     await pymToken.transfer(addr2.address, FUNDING_GOAL);
  //     await pymToken.connect(addr2).approve(await projectFunding.getAddress(), FUNDING_GOAL);
  //     await projectFunding.connect(addr2).fundProjectWithPYM(0, FUNDING_GOAL);

  //     await expect(projectFunding.connect(addr1).withdrawFunds(0))
  //       .to.emit(projectFunding, "FundsWithdrawn")
  //       .withArgs(0, FUNDING_GOAL);
  //   });

  //   it("Debería revertir si el proyecto no ha sido financiado", async function () {
  //     await expect(projectFunding.connect(addr1).withdrawFunds(0))
  //       .to.be.revertedWith("El proyecto no ha sido financiado");
  //   });

  //   it("Debería revertir si el que intenta retirar no es el creador del proyecto", async function () {
  //     await pymToken.transfer(addr2.address, FUNDING_GOAL);
  //     await pymToken.connect(addr2).approve(projectFunding.getAddress(), FUNDING_GOAL);
  //     await projectFunding.connect(addr2).fundProjectWithPYM(0, FUNDING_GOAL);

  //     await expect(projectFunding.connect(addr2).withdrawFunds(0))
  //       .to.be.revertedWith("Solo el creador del proyecto puede retirar los fondos");
  //   });
  // });

  describe("Funciones de Consulta", () => {
    it("Debería devolver todos los proyectos", async function () {
      await pymToken.connect(addr1).approve(await projectFunding.getAddress(), MIN_PYM_FOR_PROJECT_CREATION);
      await projectFunding.connect(addr1).createProject("Proyecto 1", addr1.address, FUNDING_GOAL);
      await projectFunding.connect(addr1).createProject("Proyecto 2", addr1.address, FUNDING_GOAL);

      const projects = await projectFunding.getAllProjects();
      expect(projects.length).to.equal(2);
    });
  });


});