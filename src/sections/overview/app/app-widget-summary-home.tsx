import type { CardProps } from '@mui/material/Card';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';

import { fNumber, fPercent } from 'src/utils/format-number';

import { useChart } from 'src/components/chart';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title: string;
  total: string;
  percent?: number;
  colorFigure: string;
  note?: string;
  numberDate?: {
    value?: number;
    description: string;
  };
};

export function HomeWidgetSummary({
  title,
  percent,
  total,
  colorFigure,
  note,
  numberDate,
  sx,
  ...other
}: Props) {
  const theme = useTheme();

  const chartOptions = useChart({
    chart: { sparkline: { enabled: true } },
    colors: [theme.palette.primary.main],
    stroke: { width: 0 },
    xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'] },
    tooltip: {
      y: { formatter: (value: number) => fNumber(value), title: { formatter: () => '' } },
    },
    plotOptions: { bar: { borderRadius: 1.5, columnWidth: '64%' } },
  });

  const renderTrending = () => (
    <Box sx={{ gap: 0.5, display: 'flex', alignItems: 'center' }}>
      <Iconify
        width={24}
        icon={
          percent && percent < 0
            ? 'solar:double-alt-arrow-down-bold-duotone'
            : 'solar:double-alt-arrow-up-bold-duotone'
        }
        sx={{
          flexShrink: 0,
          color: percent && percent > 0 ? 'success.main' : 'error.main',
        }}
      />

      <Box component="span" sx={{ typography: 'subtitle2' }}>
        {percent && percent > 0 && '+'}
        {percent && fPercent(percent)}
      </Box>

      <Box component="span" sx={{ typography: 'body2', color: 'text.secondary' }}>
        last 7 days
      </Box>
    </Box>
  );

  const renderNote = () => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        typography: 'body2',
        backgroundColor: '#212B36',
        width: 'fit-content',
        borderRadius: 1,
        p: '4px 8px',
        color: '#E6ECF4 ',
      }}
    >
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: 'success.main',
          mr: 0.5,
        }}
      />
      {note}
    </Box>
  );

  const renderNumberDate = () => (
    <Box
      component="span"
      sx={{ typography: 'body2', color: 'text.primary', display: 'flex', alignItems: 'center' }}
    >
      {numberDate && numberDate.value ? (
        <Iconify
          width={24}
          icon={
            numberDate && numberDate.value && numberDate.value < 0
              ? 'solar:double-alt-arrow-down-bold-duotone'
              : 'solar:double-alt-arrow-up-bold-duotone'
          }
          sx={{
            flexShrink: 0,
            color:
              numberDate && numberDate.value && numberDate.value < 0
                ? 'error.main'
                : 'success.main',
          }}
        />
      ) : null}
      {numberDate && `${numberDate.value || ''} ${numberDate.description}`}
    </Box>
  );

  return (
    <Card
      sx={[
        () => ({
          p: 3,
          display: 'flex',
          zIndex: 'unset',
          backgroundColor: 'rgba(28, 37, 46, 0.40)',
          alignItems: 'center',
          overflow: 'hidden',
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ typography: 'subtitle2' }}>{title}</Box>

        <Box sx={{ mt: 1.5, mb: 1, typography: 'h3' }}>{total}</Box>

        {percent && renderTrending()}
        {note && renderNote()}
        {numberDate && renderNumberDate()}
      </Box>

      {/* <SvgColor
        src={icon}
        sx={{
          top: 50,
          right: 20,
          width: 36,
          height: 36,
          position: 'absolute',
          background: `linear-gradient(135deg, ${theme.vars.palette.primary.main} 0%, ${theme.vars.palette.primary.dark} 100%)`,
        }}
      /> */}

      <Box
        sx={{
          top: -44,
          width: 160,
          zIndex: -1,
          height: 190,
          right: -104,
          opacity: 0.12,
          borderRadius: 3,
          position: 'absolute',
          transform: 'rotate(40deg)',
          background: `linear-gradient(to right, ${colorFigure}, transparent)`,
        }}
      />
    </Card>
  );
}
