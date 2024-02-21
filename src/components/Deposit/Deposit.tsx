import {
  TextInput,
  NumberInput,
  Text,
  Button,
  Divider,
  Anchor,
  Stack,
  Box,
  Alert,
  Grid,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { isAddress as isEthAddress } from 'web3-validator';
import { IconCheck, IconX, IconInfoCircle, IconExternalLink } from '@tabler/icons-react';

import { tezosToolkit as Tezos } from '@/lib/beacon/beacon';
import { tezToMutez } from '@/lib/utils/utils';
import { EvmBridgeWalletType } from '@/lib/types/evm_bridge.types';
import { tas } from '@/lib/types/type-aliases';
import { useConnection } from '@/contexts/TezosContext/TezosContext';

export function Deposit() {
  const { address } = useConnection();
  const form = useForm({
    initialValues: {
      ethAddress: '',
      amount: 0,
    },

    validate: {
      ethAddress: (val) => (isEthAddress(val) ? null : 'Invalid Etherlink address'),
      amount: (val) => (val > 0 ? null : 'Invalid amount: must be greater than 0'),
    },
  });

  const deposit = async (ethAddress: string, amount: number) => {
    const bridgeContractAddress = process.env.NEXT_PUBLIC_BRIDGE_ADDRESS;
    const rollupContractAddress = process.env.NEXT_PUBLIC_ROLLUP_ADDRESS;
    const amountTez = tezToMutez(amount);

    try {
      if (!bridgeContractAddress || !rollupContractAddress) {
        throw new Error('Missing contract or rollup address');
      }

      const bridgeContract = await Tezos.wallet.at<EvmBridgeWalletType>(bridgeContractAddress);

      const tx = bridgeContract.methods.deposit(
        tas.bytes(rollupContractAddress),
        tas.address(ethAddress)
      );

      const operation = await tx.send({ amount: amountTez, mutez: true });
      await operation.confirmation(2);

      notifications.show({
        title: 'Deposit successful',
        message: `You have successfully deposited ${amountTez} ctez.`,
        icon: <IconCheck size="1.1rem" />,
        color: 'teal',
      });
    } catch (err) {
      console.error(err);

      notifications.show({
        title: 'Deposit failed',
        message: `Something went wrong: ${(err as Error).message}`,
        icon: <IconX size="1.1rem" />,
        color: 'red',
      });
    }
  };

  return (
    <Box>
      <Alert variant="light" my="sm" py="lg" icon={<IconInfoCircle />} title="Important">
        <Text size="sm">
          This is a testnet. You can request free Ghostnet ꜩ from
          <Anchor href="https://faucet.ghostnet.teztnets.com" target="_blank">
            {' '}
            the faucet. <IconExternalLink size="0.8rem" />
          </Anchor>
        </Text>
      </Alert>

      <form
        onSubmit={form.onSubmit((values) => {
          (async () => {
            await deposit(values.ethAddress, values.amount);
          })();
        })}
      >
        <Stack>
          <Grid justify="center" align="center">
            <Grid.Col>
              <TextInput
                label="Etherlink Address"
                placeholder="0x0000000000000000000000000000000000000000"
                // value={form.values.ethAddress}
                // onChange={(event) =>
                //   form.setFieldValue('ethAddress', event.currentTarget.value)
                // }
                variant="unstyled"
                error={form.errors.ethAddress}
                radius="xs"
                size="lg"
                inputWrapperOrder={['label', 'input', 'error']}
                {...form.getInputProps('ethAddress')}
              />
            </Grid.Col>
            {/* <Grid.Col span={3}>
              <Button variant="default" color="gray" radius="xl" size="sm" leftIcon={<EthIcon />}>
                Fill in with EVM wallet
              </Button>

            </Grid.Col> */}
          </Grid>

          <NumberInput
            label="Amount"
            placeholder="10"
            error={form.errors.amount}
            radius="md"
            size="lg"
            variant="unstyled"
            hideControls
            {...form.getInputProps('amount')}
          />
        </Stack>

        <Divider my="xl" />

        <Stack>
          {address && address.length ? (
            <Button variant="light" radius="xl" size="lg" type="submit">
              Move funds to Etherlink
            </Button>
          ) : (
            <Button radius="xl" size="lg" disabled>
              Connect your wallet before moving funds
            </Button>
          )}
        </Stack>
      </form>
    </Box>
  );
}
