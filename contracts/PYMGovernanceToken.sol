// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PYMToken is ERC20, Ownable {
    uint256 public constant INITIAL_SUPPLY = 100_000_000 * 10 ** 18;
    uint256 public proposalCount = 0;

    struct Proposal {
        uint256 id;
        string description;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 startTime;
        uint256 snapshotBlock;
        bool executed;
    }

    mapping(uint256 => Proposal) public proposals;
    mapping(address => uint256) public delegatedVotes;
    mapping(uint256 => mapping(address => bool)) public hasVoted; // el primer id representa el id de la propuesta y el segundo id representa la dirección del votante

    event ProposalCreated(uint256 id, string description);
    event Voted(uint256 proposalId, uint8 support, address voter);
    event ProposalExecuted(uint256 proposalId);

    constructor() ERC20("Pymecrypto Governance Token", "PYM") Ownable(msg.sender) {
        _mint(msg.sender, INITIAL_SUPPLY * 50 / 100); // Community and rewards (50%)
        _mint(address(this), INITIAL_SUPPLY * 30 / 100); // Treasury and reserves (30%)
        _mint(owner(), INITIAL_SUPPLY * 20 / 100); // Team allocation (20%)
    }

    // Acuñación solo permitida para el propietario
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    // Se permite al dueño quemar sus tokens con esta función
    function burn(uint256 amount) external onlyOwner() {
        _burn(msg.sender, amount);
    }

    // Funcion para crear propuestas de gobernanza (requiere al menos 1,000 tokens PYM)
    function createProposal(string memory description) external {
        require(balanceOf(msg.sender) >= 1_000 * 10 ** 18, "No tiene suficientes tokens PYM");
        
        proposals[proposalCount] = Proposal({
            id: proposalCount,
            description: description,
            votesFor: 0,
            votesAgainst: 0,
            startTime: block.timestamp,
            executed: false,
            snapshotBlock: block.number //para evitar que se vote en el mismo bloque
        });
        
        emit ProposalCreated(proposalCount, description);
        proposalCount++;
    }

    // Función para votar en una propuesta
    function vote(uint256 proposalId, uint8 support) external {
        Proposal storage proposal = proposals[proposalId];
        require(block.timestamp < proposal.startTime + 7 days, "El periodo de voto ha terminado"); //El periodo de votación es de 7 días
        require(!hasVoted[proposalId][msg.sender], "Ya has votado en esta propuesta");

        uint256 votingPower = _getPastVotes(msg.sender, proposal.snapshotBlock) / 1e18; //Guarda la data de los votos en numeros mas legibles
        require(votingPower > 0, "No tienes poder de voto");

        if (support == 1) {
        proposal.votesFor += votingPower;
        } else if (support == 0) {
            proposal.votesAgainst += votingPower;
        } else {
            revert("Opcion de voto invalida");
        }

        hasVoted[proposalId][msg.sender] = true;

        emit Voted(proposalId, support, msg.sender);
    }

    function _getPastVotes(address account, uint256 blockNumber) internal view returns (uint256) {
        require(block.number > blockNumber, "No puede conseguir votos de un bloque futuro");
        uint256 votes = balanceOf(account);
        votes += delegatedVotes[account];
        return votes;
    }

    // Funcion para ejecutar la propuesta si tiene la mayoria de los votos
    function executeProposal(uint256 proposalId) external onlyOwner {
        Proposal storage proposal = proposals[proposalId];
        require(!proposal.executed, "La propuesta ya ha sido ejecutada");
        require(block.timestamp >= proposal.startTime + 7 days, "El periodo de voto no ha terminado");

        if (proposal.votesFor > proposal.votesAgainst) {
            proposal.executed = true;
            emit ProposalExecuted(proposalId);
            // Aqui Falta implementar acciones
        }
    }

    // Función para delegar poder de voto a otra dirección
    function delegateVote(address delegatee) external {
        require(balanceOf(msg.sender) > 0, "No tiene tokens para delegar");
        delegatedVotes[delegatee] += balanceOf(msg.sender) / 1e18;
    }

    // Función para distribuir recompensas utilizando los tokens del contrato
    function distributeRewards(address[] memory recipients, uint256[] memory amounts) external onlyOwner {
        require(recipients.length == amounts.length, "Longitudes no coinciden");
        for (uint256 i = 0; i < recipients.length; i++) {
            _transfer(address(this), recipients[i], amounts[i]);
        }
    }
}