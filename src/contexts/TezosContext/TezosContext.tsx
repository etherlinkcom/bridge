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

// todo: this shouldnt know about nextjs
// the email modal should live in @kanvas/client/ui
// and we should simply handle it here
import { Context, createContext, useContext, useEffect, useState } from 'react';
// import { useCookies } from 'react-cookie'
import { setCookie } from 'cookies-next';
import { NetworkType } from '@airgap/beacon-types';

import { connectBeacon } from '@/lib/beacon/beacon';
import { WalletApi } from '@/lib/beacon/beacon-types';

interface ConnectionContextType extends Partial<WalletApi> {
  connect: () => Promise<void>;
  network: string;
  setNetwork: (network: NetworkType) => void;
}

const ConnectionContext = createContext<ConnectionContextType | null>(null);

export const ConnectionProvider = ({ children }: { children: any }) => {
  const [wallet, setWallet] = useState<WalletApi | undefined>();
  const [network, setNetwork] = useState<NetworkType>(NetworkType.GHOSTNET);

  const setWalletCookie = (address: string | undefined) => {
    setCookie('viewer-address', address, {
      maxAge: 60 * 60 * 24 * 30,
    });
  };

  useEffect(() => {
    setWalletCookie(wallet?.address);
  }, [wallet?.address]);

  useEffect(() => {
    connectBeacon(false, network)
      .then(setWallet)
      .catch(() => {
        console.log('no existing beacon connection');
      });
  }, []);

  const onInitialConnectionComplete = async (walletApi: WalletApi): Promise<void> => {
    setWallet(walletApi);
    // const { address, connection } = wallet;
    // return connection;
  };

  // eslint-disable-next-line @typescript-eslint/require-await
  const disconnect = async function () {
    console.log('disconnecting');
    setWallet(undefined);
    setWalletCookie(undefined);
  };

  return (
    <ConnectionContext.Provider
      value={{
        connect: async () =>
          connectBeacon(true, network)
            .then(onInitialConnectionComplete)
            .catch((err) => {
              disconnect();
              throw new Error(`Error connecting to wallet, please try again later ${err.message}`);
            }),
        ...wallet,
        disconnect: async () => {
          await disconnect();
          await wallet?.disconnect();
        },
        network,
        setNetwork: async (newNetwork: NetworkType) => {
          setNetwork(newNetwork);
          await disconnect();
          await wallet?.disconnect();
          connectBeacon(true, newNetwork)
            .then(onInitialConnectionComplete)
            .catch(() => {
              disconnect();
              throw new Error('Error connecting to wallet, please try again later');
            });
        },
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};

export type NotNothing<T> = T extends null | undefined ? never : T;

/**
 * Managing wallet connects and disconnects with kukai and beacon
 * and registering the connection with kanvas
 */
export const useConnection = (): ConnectionContextType => {
  if (!ConnectionContext) throw new Error('WalletContext not initialized');
  return useContext(ConnectionContext as NotNothing<Context<ConnectionContextType>>);
};
