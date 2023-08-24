import {
  createStyles,
  Footer as MantineFooter,
  Container,
  Group,
  Anchor,
  rem,
} from '@mantine/core';

const useStyles = createStyles((theme) => ({
  footer: {
    marginTop: rem(120),
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
  },

  inner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,

    [theme.fn.smallerThan('xs')]: {
      flexDirection: 'column',
    },
  },

  links: {
    [theme.fn.smallerThan('xs')]: {
      marginTop: theme.spacing.md,
    },
  },
}));

const links = [
  {
    link: 'https://explorer.ghostnet-evm.tzalpha.net/',
    label: 'EVM Explorer',
  },
  {
    link: 'https://tezos.gitlab.io/alpha/smart_rollups.html',
    label: 'Smart Optimistic Rollups Documentation',
  },
];

export function Footer() {
  const { classes } = useStyles();
  const items = links.map((link) => (
    <Anchor
      color="dimmed"
      key={link.label}
      href={link.link}
      target="_blank"
      // onClick={(event) => event.preventDefault()}
      size="sm"
    >
      {link.label}
    </Anchor>
  ));

  return (
    <MantineFooter height={60}>
      <Container className={classes.inner}>
        <Group>{items}</Group>
      </Container>
    </MantineFooter>
  );
}
