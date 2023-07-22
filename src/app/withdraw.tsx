'use client';

import { useState } from 'react';
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
} from '@mantine/core';
import { useToggle, upperFirst } from '@mantine/hooks';
import { useForm } from '@mantine/form';

import { useConnection } from '@/contexts/TezosWalletContext';
import { WalletButton } from '@/components/WalletButton';
import { SvgCustomBeacon } from '@/icons/Beacon';

export function Withdraw() {
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
      ethAddress: '',
      amount: 0,
    },

    validate: {
      ethAddress: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
    },
  });

  console.log(address);

  return (
    <Paper radius='md' p='xl' withBorder>
      <Text size='lg' weight={500} my='xl' fw='700'>
        Enter the amount of tokens you want to move to your Tezos address
      </Text>

      <form
        onSubmit={form.onSubmit(() => {
          console.log('Submitted');
        })}
      >
        <Stack>
          <NumberInput
            required
            label='Amount'
            placeholder='10'
            value={form.values.amount}
            onChange={(event) => form.setFieldValue('amount', Number(event))}
            error={form.errors.email && 'Invalid email'}
            radius='md'
            size='lg'
            hideControls
          />
        </Stack>
        <Divider my='xl' />
        <Stack>
          <Button type='submit' radius='xl' size='lg'>
            Move funds to Layer 1
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}
