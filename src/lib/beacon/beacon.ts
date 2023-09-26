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
/* eslint-disable @typescript-eslint/no-use-before-define */
import { BeaconWallet } from '@taquito/beacon-wallet';
import { PermissionScope, NetworkType } from '@airgap/beacon-types';

import { MichelCodecPacker, TezosToolkit } from '@taquito/taquito';
import { ConnectFn } from './beacon-types';

// const NETWORK_RPC: { [key in string]: string } = {
//   [NetworkType.GHOSTNET]: 'https://rpc.ghostnet.teztnets.xyz',
//   [NetworkType.DAILYNET]: 'https://rpc.dailynet-2023-09-21.teztnets.xyz',
// };

const createBeaconWallet = (network: NetworkType): BeaconWallet | undefined =>
  typeof window === 'undefined'
    ? undefined
    : new BeaconWallet({
        name: 'Etherlink Bridge',
        network: {
          type: network,
          rpcUrl: 'https://rpc.ghostnet.teztnets.xyz',
        },
        // featuredWallets: ['kukai', 'trust', 'temple', 'umami'],
      });

export const connectBeacon: ConnectFn = async (isNew, network) => {
  if (!isNew) {
    const existingWallet = createBeaconWallet(network);
    const acc = await existingWallet?.client.getActiveAccount();

    if (!existingWallet || !acc) {
      throw new Error();
    }

    return {
      address: acc.address,
      connection: {
        imageUrl: undefined,
        connectionType: 'beacon',
        name: undefined,
      },
      // callcontract: callContractBeaconFn(existingWallet),
      disconnect: async () => {
        await existingWallet.client.disconnect();
      },
    };
  }
  const beaconWallet = createBeaconWallet(network);
  // tezosToolkit.setRpcProvider(NETWORK_RPC[network]);
  tezosToolkit.setWalletProvider(beaconWallet);

  if (!beaconWallet) {
    throw new Error('Tried to connect on the server');
  }

  const response = await beaconWallet.client.requestPermissions({
    network: {
      type: NetworkType.GHOSTNET,
      rpcUrl: process.env.NEXT_PUBLIC_NODE_URL,
    },
    scopes: [PermissionScope.OPERATION_REQUEST],
  });

  return {
    address: response.address,
    connection: {
      imageUrl: undefined,
      // connectionType,
    },
    // callcontract: callContractBeaconFn(beaconWallet),
    disconnect: async () => {
      await beaconWallet.client.disconnect();
    },
  };
};

export const tezosToolkit = new TezosToolkit(
  process.env.NEXT_PUBLIC_NODE_URL || 'https://rpc.ghostnet.teztnets.xyz'
);
tezosToolkit.setPackerProvider(new MichelCodecPacker());
