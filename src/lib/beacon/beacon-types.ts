/**
 * Some parts of this file are derived from or inspired by the following:
 * [Astro Ninja](https://github.com/trilitech/astro-ninja.git)
 *
 * Original Author: TriliTech
 * Original License: Unlicensed
 *
 * Modifications were made to the original file for integration into this project.
 * All modifications are licensed under: MIT
 */

import { NetworkType } from '@airgap/beacon-types';

export interface WalletConnection {
  imageUrl?: string;
  connectionType?: string;
  name?: string;
}
export interface WalletInfo {
  address: string;
  connection: WalletConnection;
}
export interface ContractCallDetails {
  contractAddress: string;
  amountMutez: number;
  id: string;
}

export interface WalletApi {
  // callcontract: (details: ContractCallDetails) => Promise<string | undefined>;
  address: string;
  connection: WalletConnection;
  disconnect: () => Promise<void>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface BeaconOptions {}
export interface KukaiOptions {
  showEmail?: boolean;
}

export type ConnectFn = (
  isNewConnection: boolean,
  network: NetworkType,
  connectionOptions?: BeaconOptions
) => Promise<WalletApi>;
