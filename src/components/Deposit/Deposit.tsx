import { TextInput, NumberInput, Text, Paper, Button, Divider, Anchor, Stack } from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { isAddress as isEthAddress } from 'web3-validator';
import { OpKind } from '@taquito/taquito';
import { IconCheck, IconX } from '@tabler/icons-react';

import { tezosToolkit as Tezos } from '@/lib/beacon/beacon';
import { mutezToTez } from '@/lib/utils/utils';
import { useConnection } from '@/contexts/TezosContext/TezosContext';

export function Deposit() {
  const { address } = useConnection();
  const [type, toggle] = useToggle(['input', 'wallet']);
  const form = useForm({
    initialValues: {
      ethAddress: '',
      amount: 0,
    },

    validate: {
      ethAddress: (val) => (isEthAddress(val) ? null : 'Invalid Ethereum address'),
      amount: (val) => (val > 0 ? null : 'Invalid amount: must be greater than 0'),
    },
  });

  const deposit = async (ethAddress: string, amount: number) => {
    const ctezContractAddress = process.env.NEXT_PUBLIC_CTEZ_CONTRACT_ADDRESS;
    const bridgeContractAddress = process.env.NEXT_PUBLIC_BRIDGE_CONTRACT_ADDRESS;

    try {
      if (!ctezContractAddress || !bridgeContractAddress) {
        throw new Error('Missing contract address');
      }

      const ctezContract = await Tezos.wallet.at(ctezContractAddress);
      const bridgeContract = await Tezos.wallet.at(bridgeContractAddress);

      const txs = [
        {
          kind: OpKind.TRANSACTION as OpKind.TRANSACTION,
          ...ctezContract.methods
            .approve(bridgeContractAddress, mutezToTez(amount))
            .toTransferParams(),
        },
        {
          kind: OpKind.TRANSACTION as OpKind.TRANSACTION,

          ...bridgeContract.methods
            .deposit(mutezToTez(amount), ethAddress, 21000)
            .toTransferParams(),
        },
      ];

      const operation = await Tezos.wallet.batch(txs).send();
      await operation.confirmation(2);

      notifications.show({
        title: 'Deposit successful',
        message: `You have successfully deposited ${amount} ctez.`,
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
    <Paper radius="md" p="xl" withBorder>
      <Text size="lg" weight={500} my="xl" fw="700">
        Enter your Ethereum address and the amount of tokens you want to move to
      </Text>

      <form
        onSubmit={form.onSubmit((values) => {
          (async () => {
            await deposit(values.ethAddress, values.amount);
          })();
        })}
      >
        <Stack>
          <TextInput
            required
            label="Ethereum Address"
            placeholder="0x0260bF7..."
            // value={form.values.ethAddress}
            // onChange={(event) =>
            //   form.setFieldValue('ethAddress', event.currentTarget.value)
            // }
            error={form.errors.ethAddress}
            radius="md"
            size="lg"
            inputWrapperOrder={['label', 'input', 'error', 'description']}
            descriptionProps={{ position: 'absolute', right: 0 }}
            description={
              <Anchor
                component="button"
                type="button"
                color="dimmed"
                onClick={() => toggle()}
                size="xs"
                disabled
              >
                {type === 'input' ? 'Fill in with wallet (soon...)' : 'Fill in with input'}
              </Anchor>
            }
            {...form.getInputProps('ethAddress')}
          />

          <NumberInput
            required
            label="Amount"
            placeholder="10"
            error={form.errors.amount}
            radius="md"
            size="lg"
            hideControls
            {...form.getInputProps('amount')}
          />
        </Stack>

        <Divider my="xl" />

        <Stack>
          {address && address.length ? (
            <Button type="submit" radius="xl" size="lg">
              Move funds to EVM Rollup
            </Button>
          ) : (
            <Button radius="xl" size="lg" disabled>
              Login before moving funds
            </Button>
          )}
        </Stack>
      </form>
    </Paper>
  );
}
