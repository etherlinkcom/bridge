'use client';

import { useState } from 'react';
import {
  TextInput,
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

export function Main() {
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
  const [type, toggle] = useToggle(['login', 'register']);
  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
      terms: true,
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) =>
        val.length <= 6
          ? 'Password should include at least 6 characters'
          : null,
    },
  });

  console.log(address);

  return (
    <Paper radius='md' p='xl' withBorder>
      <Text size='lg' weight={500}>
        Welcome to Mantine, {type} with
      </Text>

      <Group grow mb='md' mt='md'>
        <WalletButton
          radius='xl'
          leftIcon={<SvgCustomBeacon />}
          onClick={connect}
        >
          Google
        </WalletButton>
        <WalletButton radius='xl'>Twitter</WalletButton>
      </Group>

      <Divider label='Or continue with email' labelPosition='center' my='lg' />

      <form
        onSubmit={form.onSubmit(() => {
          console.log('Submitted');
        })}
      >
        <Stack>
          {type === 'register' && (
            <TextInput
              label='Name'
              placeholder='Your name'
              value={form.values.name}
              onChange={(event) =>
                form.setFieldValue('name', event.currentTarget.value)
              }
              radius='md'
            />
          )}

          <TextInput
            required
            label='Email'
            placeholder='hello@mantine.dev'
            value={form.values.email}
            onChange={(event) =>
              form.setFieldValue('email', event.currentTarget.value)
            }
            error={form.errors.email && 'Invalid email'}
            radius='md'
          />

          <PasswordInput
            required
            label='Password'
            placeholder='Your password'
            value={form.values.password}
            onChange={(event) =>
              form.setFieldValue('password', event.currentTarget.value)
            }
            error={
              form.errors.password &&
              'Password should include at least 6 characters'
            }
            radius='md'
          />

          {type === 'register' && (
            <Checkbox
              label='I accept terms and conditions'
              checked={form.values.terms}
              onChange={(event) =>
                form.setFieldValue('terms', event.currentTarget.checked)
              }
            />
          )}
        </Stack>

        <Group position='apart' mt='xl'>
          <Anchor
            component='button'
            type='button'
            color='dimmed'
            onClick={() => toggle()}
            size='xs'
          >
            {type === 'register'
              ? 'Already have an account? Login'
              : "Don't have an account? Register"}
          </Anchor>
          <Button type='submit' radius='xl'>
            {upperFirst(type)}
          </Button>
        </Group>
      </form>
    </Paper>
  );
}
