import { useState } from 'react';
import NextApp, { AppProps, AppContext } from 'next/app';
import { getCookie, setCookie } from 'cookies-next';
import Head from 'next/head';
import { MantineProvider, ColorScheme, ColorSchemeProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

import { ConnectionProvider } from '@/contexts/TezosContext/TezosContext';

export default function App(props: AppProps & { colorScheme: ColorScheme }) {
  const { Component, pageProps } = props;
  const [colorScheme, setColorScheme] = useState<ColorScheme>(props.colorScheme);

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextColorScheme);
    setCookie('mantine-color-scheme', nextColorScheme, { maxAge: 60 * 60 * 24 * 30 });
  };

  return (
    <>
      <Head>
        <title>Etherlink Bridge</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <link rel="shortcut icon" href="/favicon.svg" />
      </Head>

      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <MantineProvider
          theme={{
            fontFamily: 'Raleway, sans-serif',
            fontFamilyMonospace: 'Monaco, Courier, monospace',
            colors: {
              'nl-blue': [
                '#e5f5ff',
                '#cee5ff',
                '#9cc9ff',
                '#66abfe',
                '#3c92fc',
                '#2382fc',
                '#137afe',
                '#0068e3',
                '#005ccb',
                '#004fb4',
              ],
            },
            primaryColor: 'nl-blue',
            colorScheme,
          }}
          withGlobalStyles
          withNormalizeCSS
        >
          <ConnectionProvider>
            <Component {...pageProps} />
            <Notifications />
          </ConnectionProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
}

App.getInitialProps = async (appContext: AppContext) => {
  const appProps = await NextApp.getInitialProps(appContext);
  return {
    ...appProps,
    colorScheme: getCookie('mantine-color-scheme', appContext.ctx) || 'dark',
  };
};
