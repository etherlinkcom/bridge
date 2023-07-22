'use client';

import { useState } from 'react';
import axios from 'axios';
import {
  TextInput,
  NumberInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  Button,
  Divider,
  Checkbox,
  Anchor,
  Stack,
  useMantineTheme,
  ColorScheme,
  Alert,
} from '@mantine/core';
import { useToggle, upperFirst } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import {
  IconAlertCircle,
  IconExternalLink,
  IconCheck,
  IconX,
} from '@tabler/icons-react';

import { useConnection } from '@/contexts/TezosWalletContext';
import { WalletButton } from '@/components/WalletButton';
import { TezosIcon } from '@/icons/Tezos';
import { SvgCustomBeacon } from '@/icons/Beacon';
import Link from 'next/link';

export function Faucet() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  const theme = useMantineTheme();
  const { address, connect } = useConnection();

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme =
      value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextColorScheme);
    // setCookie('mantine-color-scheme', nextColorScheme, { maxAge: 60 * 60 * 24 * 30 });
  };

  const [opened, setOpened] = useState(false);
  const [type, toggle] = useToggle(['input', 'wallet']);
  const form = useForm({
    initialValues: {
      address: '',
    },
  });

  const getTokens = async (address: string) => {
    console.log('getTokens', address);
    try {
      notifications.show({
        id: 'faucet',
        title: 'Sending...',
        message: 'Your tokens are on the way! 🚀',
        loading: true,
        autoClose: false,
      });

      await axios.get(
        `https://faucet-bot.marigold.dev/network/ghostnet/getmoney/CTEZ/${address}`,
      );

      notifications.update({
        id: 'faucet',
        title: 'Success!',
        message: 'Check your wallet !',
        icon: <IconCheck size='1.1rem' />,
        color: 'teal',
      });
    } catch (err: any) {
      notifications.update({
        id: 'faucet',
        title: 'Error!',
        message: `Something went wrong: ${(err as Error).message}`,
        icon: <IconX size='1.1rem' />,
        color: 'red',
      });
    }
  };
  console.log(address);

  return (
    <Paper radius='md' p='xl' withBorder>
      <Alert icon={<IconAlertCircle size='1rem' />} mb='1.5rem'>
        This faucet is provided by Marigold. <br />
        <Anchor href='https://faucet.marigold.dev' target='_blank'>
          {' '}
          Check it out. <IconExternalLink size='0.8rem' />
        </Anchor>
      </Alert>

      <Text size='lg' weight={500} my='xl' fw='700'>
        Connect your Tezos wallet
      </Text>

      <Stack>
        {address && address.length ? (
          <WalletButton
            radius='xl'
            size='lg'
            // leftIcon={<TezosIcon />}
            onClick={async () => await getTokens(address)}
          >
            Request ctez tokens for {address}
          </WalletButton>
        ) : (
          <WalletButton
            radius='xl'
            size='lg'
            leftIcon={<TezosIcon />}
            onClick={connect}
          >
            Connect
          </WalletButton>
        )}
      </Stack>

      <Divider my='xl' />
      <Text size='lg' weight={500} my='xl' fw='700'>
        Or enter a valid Tezos address to receive tokens
      </Text>

      <form
        onSubmit={form.onSubmit((values) => {
          void (async () => {
            await getTokens(values.address);
          })();
        })}
      >
        <Stack>
          <TextInput
            required
            label='Tezos address'
            placeholder='tz1...'
            value={form.values.address}
            onChange={(event) =>
              form.setFieldValue('address', event.currentTarget.value)
            }
            error={form.errors.email && 'Invalid address'}
            radius='xl'
            size='lg'
          />
          <Button type='submit' radius='xl' size='lg'>
            Request ctez tokens
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}
