import { alpha, Button as BaseButton, ButtonProps as BaseButtonProps } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import Color from '../../constants/Color';

const StyledBaseButton = styled(({ nowrap: boolean, selected, ...rest }) => <BaseButton {...rest} />)`
  white-space: ${({ nowrap }) => (nowrap ? 'nowrap' : 'normal')};
  ${({ selected, theme }) => {
    if (!selected) {
      return '';
    }

    const isDark = theme.palette.mode === 'dark';
    const level = isDark ? '50' : '900';

    return `
      background-color: ${alpha(Color.Neutral[level], 0.1)};
      border-color: ${alpha(Color.Neutral[level], 0.3)} !important;
    `;
  }}
`;

function getColor(theme, variant) {
  switch (variant) {
    case 'contained':
      return theme.palette.danger.contrastText;
    default:
      return theme.palette.danger.main;
  }
}

const DangerButton = styled(StyledBaseButton)`
  color: ${({ theme, variant }) => getColor(theme, variant)};
  ${({ theme, variant }) => (variant === 'contained' ? `background-color: ${theme.palette.danger.main};` : undefined)}

  &:hover {
    color: ${({ theme, variant }) => getColor(theme, variant)};
    ${({ theme, variant }) => (variant === 'contained' ? `background-color: ${theme.palette.danger.main};` : undefined)}
  }
`;

export type ButtonProps = Omit<BaseButtonProps, 'color'> & {
  color?: BaseButtonProps['color'] | 'danger';
  to?: string | Object;
  nowrap?: boolean;
  selected?: boolean;
};

export default function Button(props: ButtonProps) {
  const { color = 'secondary', to, onClick, disableElevation = true, ...rest } = props;

  const navigate = useNavigate();

  function handleClick(...args) {
    if (to) {
      navigate(to);
    }

    if (onClick) {
      onClick(...args);
    }
  }

  switch (color) {
    case 'danger':
      return <DangerButton onClick={handleClick} disableElevation={disableElevation} {...rest} />;
    case 'primary':
      return <StyledBaseButton onClick={handleClick} disableElevation={disableElevation} color="primary" {...rest} />;
    case 'secondary':
      return <StyledBaseButton onClick={handleClick} disableElevation={disableElevation} color="secondary" {...rest} />;
    default:
      return <StyledBaseButton onClick={handleClick} disableElevation={disableElevation} {...rest} />;
  }
}
