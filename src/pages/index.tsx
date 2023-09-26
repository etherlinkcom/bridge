import { AppShell, Tabs, Container, Text } from '@mantine/core';
import { IconDownload, IconUpload, IconFountain } from '@tabler/icons-react';

import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
import { Deposit } from '@/components/Deposit/Deposit';

export default function HomePage() {
  return (
    <AppShell header={<Header />} footer={<Footer />}>
      <Container>
        <Tabs radius="lg" defaultValue="deposit">
          <Tabs.List grow>
            <Tabs.Tab value="deposit" icon={<IconDownload size="1.2rem" />}>
              <Text size="md" fw={700}>
                Deposit
              </Text>
            </Tabs.Tab>
            <Tabs.Tab value="withdraw" icon={<IconUpload size="1.2rem" />} disabled>
              <Text size="md" fw={700}>
                Withdraw
              </Text>
            </Tabs.Tab>
            <Tabs.Tab value="faucet" icon={<IconFountain size="1.2rem" />} disabled>
              <Text size="md" fw={700}>
                Faucet
              </Text>
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="deposit" pt="lg">
            <Deposit />
          </Tabs.Panel>
        </Tabs>
      </Container>
    </AppShell>
  );
}
