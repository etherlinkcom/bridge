import {
  createStyles,
  Header as MantineHeader,
  Menu,
  Group,
  Container,
  Text,
  ActionIcon,
  rem,
  Button,
  useMantineColorScheme,
} from '@mantine/core';
import {
  IconSun,
  IconMoonStars,
  IconPlugConnectedX,
  IconChevronDown,
  IconSwitchHorizontal,
} from '@tabler/icons-react';

import { useConnection } from '@/contexts/TezosContext/TezosContext';
import { TezosIcon } from '@/icons/TezosIcon/TezosIcon';
import { WalletButton } from '@/components/WalletButton/WalletButton';
import { shortAddress } from '@/lib/utils/utils';

const useStyles = createStyles((theme) => ({
  inner: {
    height: rem(56),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  links: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  burger: {
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },
  },

  linkLabel: {
    marginRight: rem(5),
  },
}));

export function Header() {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const { classes } = useStyles();
  const { address, connect, disconnect } = useConnection();

  return (
    <MantineHeader height={56} mb={120}>
      <Container>
        <div className={classes.inner}>
          <Text fw={700}>Etherlink Bridge</Text>
          <Group position="center" my="xl">
            {address && address.length ? (
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <Button
                    variant="default"
                    color="gray"
                    radius="xl"
                    leftIcon={<TezosIcon />}
                    rightIcon={<IconChevronDown size="1.2rem" />}
                  >
                    {shortAddress(address)}
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item icon={<IconSwitchHorizontal size={14} />} onClick={connect}>
                    Switch Account
                  </Menu.Item>
                  <Menu.Item
                    color="red"
                    icon={<IconPlugConnectedX size={14} />}
                    onClick={disconnect}
                  >
                    Disconnect
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            ) : (
              <WalletButton radius="xl" leftIcon={<TezosIcon />} onClick={connect}>
                Connect
              </WalletButton>
            )}
            <ActionIcon
              onClick={() => toggleColorScheme()}
              size="lg"
              radius="xl"
              sx={(theme) => ({
                backgroundColor:
                  theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                color: theme.colorScheme === 'dark' ? theme.colors.yellow[4] : theme.colors.blue[6],
              })}
            >
              {colorScheme === 'dark' ? <IconSun size="1.2rem" /> : <IconMoonStars size="1.2rem" />}
            </ActionIcon>
          </Group>
        </div>
      </Container>
    </MantineHeader>
  );
}
