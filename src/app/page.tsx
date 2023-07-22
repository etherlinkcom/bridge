'use client';

import { useState } from 'react';
import {
  AppShell,
  Tabs,
  MantineProvider,
  useMantineTheme,
  ColorScheme,
  ColorSchemeProvider,
  Container,
  Text,
} from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { useToggle } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { IconDownload, IconUpload, IconFountain } from '@tabler/icons-react';
// import { GoogleButton, TwitterButton } from '../SocialButtons/SocialButtons';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ConnectionProvider } from '@/contexts/TezosWalletContext';
import { Main } from '@/app/main';

import { Deposit } from '@/app/deposit';
import { Withdraw } from '@/app/withdraw';
import { Faucet } from '@/app/faucet';

export default function Home() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  const theme = useMantineTheme();

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

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme }}
        withGlobalStyles
        withNormalizeCSS
      >
        <Notifications />
        <ConnectionProvider>
          <AppShell
            styles={{
              main: {
                background:
                  theme.colorScheme === 'dark'
                    ? theme.colors.dark[8]
                    : theme.colors.gray[0],
              },
            }}
            navbarOffsetBreakpoint='sm'
            asideOffsetBreakpoint='sm'
            footer={<Footer />}
            header={<Header />}
          >
            <Container>
              <Tabs variant='pills' radius='xl' defaultValue='deposit'>
                <Tabs.List grow>
                  <Tabs.Tab
                    value='deposit'
                    icon={<IconDownload size='1.2rem' />}
                  >
                    <Text size='md' fw={700}>
                      Deposit
                    </Text>
                  </Tabs.Tab>
                  <Tabs.Tab
                    value='withdraw'
                    icon={<IconUpload size='1.2rem' />}
                    disabled
                  >
                    <Text size='md' fw={700}>
                      Withdraw
                    </Text>
                  </Tabs.Tab>

                  <Tabs.Tab
                    value='faucet'
                    icon={<IconFountain size='1.2rem' />}
                  >
                    <Text size='md' fw={700}>
                      Faucet
                    </Text>
                  </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value='deposit' pt='lg'>
                  <Deposit />
                </Tabs.Panel>

                <Tabs.Panel value='withdraw' pt='lg'>
                  <Withdraw />
                </Tabs.Panel>

                <Tabs.Panel value='faucet' pt='lg'>
                  <Faucet />
                </Tabs.Panel>
              </Tabs>
            </Container>
          </AppShell>
        </ConnectionProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
