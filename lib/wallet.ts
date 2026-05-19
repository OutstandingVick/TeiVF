export type WalletState = {
  connected: boolean;
  address: string | null;
  network: "Solana";
  balanceSource: "Demo balance" | "Wallet balance";
};

export const demoWalletAddress = "7TeiVFzQx9pKpQx7nF2Yq7o9XxY5u9m8N2b4s6aC1dF3";

export const disconnectedWallet: WalletState = {
  connected: false,
  address: null,
  network: "Solana",
  balanceSource: "Demo balance"
};

export function createConnectedDemoWallet(): WalletState {
  return {
    connected: true,
    address: demoWalletAddress,
    network: "Solana",
    balanceSource: "Demo balance"
  };
}

export function shortenAddress(address: string, head = 4, tail = 4) {
  if (address.length <= head + tail) return address;
  return `${address.slice(0, head)}...${address.slice(-tail)}`;
}
