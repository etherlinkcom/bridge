import {
  createStyles,
  Footer as MantineFooter,
  Container,
  Group,
  Anchor,
  rem,
  ActionIcon,
} from '@mantine/core';
import { IconBrandGitlab } from '@tabler/icons-react';

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
    link: process.env.NEXT_PUBLIC_EXPLORER_URL,
    label: 'Explorer',
  },
  {
    link: process.env.NEXT_PUBLIC_SORU_DOC_URL,
    label: 'Smart Optimistic Rollups Documentation',
  },
];

const linksLeft = [
  {
    link: process.env.NEXT_PUBLIC_GIT_URL,
    icon: IconBrandGitlab,
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

  const itemsRight = linksLeft.map((link) => (
    <ActionIcon
      key={link.link}
      component="a"
      href={link.link}
      target="_blank"
      size="md"
      aria-label="Open in a new tab"
      color="nl-blue"
      radius="xl"
      variant="light"
    >
      <link.icon style={{ width: '70%', height: '70%' }} stroke={1.5} />
    </ActionIcon>
  ));

  return (
    <MantineFooter height={60}>
      <Container className={classes.inner}>
        {/* <Group position="apart" grow> */}
        <Group>{items}</Group>
        <Group>{itemsRight}</Group>
        {/* </Group> */}
      </Container>
    </MantineFooter>
  );
}
