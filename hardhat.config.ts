import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import { envs } from "./config/envs";

const config: HardhatUserConfig = {
  solidity: "0.8.27",
  networks: {
    sepolia:{
      url: `https://eth-sepolia.g.alchemy.com/v2/${envs.ALCHEMY_API_KEY}`,
      accounts: [
        `${envs.SEPOLIA_PRIVATE_KEY}`
      ],
      
    }
  },
  etherscan: {
    apiKey: envs.ETHERSCAN_API_KEY
  }

};

export default config;
