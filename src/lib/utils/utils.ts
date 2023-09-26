export const shortAddress = (address: string): string =>
  `${address.substring(0, 5)}...${address.substring(address.length - 5)}`;

export const mutezToTez = (tez: number): number => tez / 1000000;

export const tezToMutez = (mutez: number): number => mutez * 1000000;
