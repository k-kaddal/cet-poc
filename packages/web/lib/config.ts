export const config = {
  "0x539": {
    name: "Localhost 9545",
    contractAddress: "0x86BdC8D01513068e4F3AbFef6c925AcE1d9546dB",
    symbol: "ETH",
    blockExplorer: null, // leave null for testing
    rpcUrl: `http://localhost:9545`,
  },
  "0x5": {
    name: "Goerli",
    contractAddress: "",
    symbol: "ETH",
    blockExplorer: "https://goerli.etherscan.io",
    rpcUrl: `https://goerli.blockpi.network/v1/rpc/public`,
  },
  "0x13881": {
    name: "Mumbai",
    contractAddress: "0x99b65cF287740a863D2B5E74270D867316921521",
    symbol: "MATIC",
    blockExplorer: "https://mumbai.polygonscan.com",
    rpcUrl: "https://rpc-mumbai.maticvigil.com",
  },
};

/**
 * It returns true if the id is a key of the config object
 * @param {string} [id] - The network ID of the network you want to check.
 * @returns A function that takes an id and returns a boolean.
 */
export const isSupportedNetwork = (
  id?: string | null
): id is keyof typeof config => {
  return !!(id && id in config);
};