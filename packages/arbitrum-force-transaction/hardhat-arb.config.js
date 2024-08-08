require("dotenv/config")

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      chainId: 421614,
      blockGasLimit: 200000000,
      forking: {
        url: process.env.FORK_L2_RPC,
        blockNumber: 69375379 
      },
    },
  }
};
