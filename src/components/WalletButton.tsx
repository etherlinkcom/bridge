import { Button, ButtonProps, Group } from '@mantine/core';

export function WalletButton(props: ButtonProps & { onClick?: () => any }) {
  return <Button variant='default' color='gray' {...props} />;
}
