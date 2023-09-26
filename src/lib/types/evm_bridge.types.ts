import {
  ContractAbstractionFromContractType,
  WalletContractAbstractionFromContractType,
} from './type-utils';
import { address, bytes, ticket } from './type-aliases';

export type Storage = {
  exchanger: address;
  request_deposit: {
    Some: {
      evm_address: address;
      l2_address: bytes;
    };
  } | null;
};

type Methods = {
  callback: (param: ticket) => Promise<void>;
  deposit: (l2_address: bytes, evm_address: address) => Promise<void>;
};

type MethodsObject = {
  callback: (param: ticket) => Promise<void>;
  deposit: (params: { l2_address: bytes; evm_address: address }) => Promise<void>;
};

type contractTypes = {
  methods: Methods;
  methodsObject: MethodsObject;
  storage: Storage;
  code: { __type: 'EvmBridgeCode'; protocol: string; code: object[] };
};
export type EvmBridgeContractType = ContractAbstractionFromContractType<contractTypes>;
export type EvmBridgeWalletType = WalletContractAbstractionFromContractType<contractTypes>;
