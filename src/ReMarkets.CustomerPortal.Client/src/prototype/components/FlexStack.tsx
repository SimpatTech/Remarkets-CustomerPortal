import { Stack as MuiStack, type StackProps as MuiStackProps, type SxProps, type Theme } from '@mui/material';
import type { ResponsiveStyleValue } from '@mui/system';

type AlignItems = 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
type JustifyContent =
  | 'flex-start'
  | 'center'
  | 'flex-end'
  | 'space-between'
  | 'space-around'
  | 'space-evenly';
type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse';

export interface StackProps extends Omit<MuiStackProps, 'sx'> {
  alignItems?: ResponsiveStyleValue<AlignItems> | undefined;
  justifyContent?: ResponsiveStyleValue<JustifyContent> | undefined;
  flexWrap?: ResponsiveStyleValue<FlexWrap> | undefined;
  sx?: SxProps<Theme>;
}

export function Stack({ alignItems, justifyContent, flexWrap, sx, ...rest }: StackProps) {
  const flexSx: SxProps<Theme> = {
    ...(alignItems !== undefined && { alignItems }),
    ...(justifyContent !== undefined && { justifyContent }),
    ...(flexWrap !== undefined && { flexWrap }),
  };

  const mergedSx: SxProps<Theme> = Array.isArray(sx)
    ? [flexSx, ...sx]
    : sx
      ? [flexSx, sx]
      : flexSx;

  return <MuiStack {...rest} sx={mergedSx} />;
}
