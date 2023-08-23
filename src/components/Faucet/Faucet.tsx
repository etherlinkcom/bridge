import axios from 'axios';
import { TextInput, Text, Paper, Button, Divider, Anchor, Stack, Alert } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconAlertCircle, IconExternalLink, IconCheck, IconX } from '@tabler/icons-react';

import { useConnection } from '@/contexts/TezosContext/TezosContext';
import { WalletButton } from '@/components/WalletButton/WalletButton';
import { TezosIcon } from '@/icons/TezosIcon/TezosIcon';

export function Faucet() {
  const { address, connect } = useConnection();
  const form = useForm({
    initialValues: {
      address: '',
    },
  });

  const getTokens = async (targetAddress: string) => {
    try {
      notifications.show({
        id: 'faucet',
        title: 'Sending...',
        message: 'Your tokens are on the way! 🚀',
        loading: true,
        autoClose: false,
      });

      await axios.get(
        `https://faucet-bot.marigold.dev/network/ghostnet/getmoney/CTEZ/${targetAddress}`
      );

      notifications.update({
        id: 'faucet',
        title: 'Success!',
        message: 'Check your wallet !',
        icon: <IconCheck size="1.1rem" />,
        color: 'teal',
      });
    } catch (err: any) {
      notifications.update({
        id: 'faucet',
        title: 'Error!',
        message: `Something went wrong: ${(err as Error).message}`,
        icon: <IconX size="1.1rem" />,
        color: 'red',
      });
    }
  };

  return (
    <Paper radius="md" p="xl" withBorder>
      <Alert icon={<IconAlertCircle size="1rem" />} mb="1.5rem">
        This faucet is provided by Marigold. <br />
        <Anchor href="https://faucet.marigold.dev" target="_blank">
          {' '}
          Check it out. <IconExternalLink size="0.8rem" />
        </Anchor>
      </Alert>

      <Text size="lg" weight={500} my="xl" fw="700">
        Connect your Tezos wallet
      </Text>

      <Stack>
        {address && address.length ? (
          <WalletButton
            radius="xl"
            size="lg"
            // leftIcon={<TezosIcon />}
            onClick={async () => getTokens(address)}
          >
            Request ctez tokens for {address}
          </WalletButton>
        ) : (
          <WalletButton radius="xl" size="lg" leftIcon={<TezosIcon />} onClick={connect}>
            Connect
          </WalletButton>
        )}
      </Stack>

      <Divider my="xl" />
      <Text size="lg" weight={500} my="xl" fw="700">
        Or enter a valid Tezos address to receive tokens
      </Text>

      <form
        onSubmit={form.onSubmit((values) => {
          (async () => {
            await getTokens(values.address);
          })();
        })}
      >
        <Stack>
          <TextInput
            required
            label="Tezos address"
            placeholder="tz1..."
            value={form.values.address}
            onChange={(event) => form.setFieldValue('address', event.currentTarget.value)}
            error={form.errors.email && 'Invalid address'}
            radius="xl"
            size="lg"
          />
          <Button type="submit" radius="xl" size="lg">
            Request ctez tokens
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}
