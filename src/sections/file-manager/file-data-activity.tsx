import type { CardProps } from '@mui/material/Card';
import type { ChartMode } from 'src/store/alertsStore';
import type { ChartOptions } from 'src/components/chart';

import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { useTheme, alpha as hexAlpha } from '@mui/material/styles';

import useAlertsStore from 'src/store/alertsStore';
import useSubscriptionStore from 'src/store/subscriptionStore';

import { Chart, useChart, ChartSelect } from 'src/components/chart';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  // El chart ahora es opcional ya que se obtiene del store
  chart?: {
    colors?: string[];
    series: {
      name: string;
      categories?: string[];
      data: {
        name: string;
        data: number[];
      }[];
    }[];
    options?: ChartOptions;
  };
};

export function FileDataActivity({ title, subheader, chart, sx, ...other }: Props) {
  const theme = useTheme();

  const [selectedSeries, setSelectedSeries] = useState<ChartMode>('MONTHLY');

  // Hooks del store
  const { chartData, isLoadingChart, fetchAlarmChart } = useAlertsStore();
  const { selectedSubscription } = useSubscriptionStore();

  // Cargar datos del chart cuando cambia la suscripción o el modo
  useEffect(() => {
    if (selectedSubscription?.polygonId) {
      fetchAlarmChart(selectedSubscription.polygonId, selectedSeries);
    }
  }, [selectedSubscription?.polygonId, selectedSeries, fetchAlarmChart]);

  // Usar datos del store si están disponibles, sino usar props
  const currentChartData = chartData?.chart || chart;
  const currentSeries = currentChartData?.series.find((i) => i.name === selectedSeries);
  const chartTitle = chartData?.title || title || 'Alarmas';

  const chartColors = chart?.colors ?? [
    theme.palette.warning.main,
    theme.palette.error.main,
    theme.palette.primary.main,
    hexAlpha(theme.palette.grey[500], 0.48),
  ];

  const chartOptions = useChart({
    chart: { stacked: true },
    colors: chartColors,
    stroke: { width: 0 },
    legend: { show: true },
    xaxis: { categories: currentSeries?.categories },
    ...(chart?.options || {}),
  });

  const handleChangeSeries = useCallback(
    (newValue: string) => {
      const mode = newValue as ChartMode;
      setSelectedSeries(mode);

      // Llamar al método del store si hay una suscripción seleccionada
      if (selectedSubscription?.polygonId) {
        fetchAlarmChart(selectedSubscription.polygonId, mode);
      }
    },
    [selectedSubscription?.polygonId, fetchAlarmChart]
  );

  // Opciones fijas para el select (siempre las 3)
  const availableOptions: ChartMode[] = ['WEEKLY', 'MONTHLY', 'YEARLY'];

  return (
    <Card sx={sx} {...other}>
      <CardHeader
        title={chartTitle}
        subheader={subheader}
        action={
          <ChartSelect
            options={availableOptions}
            value={selectedSeries}
            onChange={handleChangeSeries}
          />
        }
      />

      {isLoadingChart ? (
        <div
          style={{
            padding: '2.5rem',
            textAlign: 'center',
            height: 370,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          Cargando...
        </div>
      ) : (
        <Chart
          type="bar"
          series={currentSeries?.data}
          options={chartOptions}
          slotProps={{ loading: { p: 2.5 } }}
          sx={{
            pl: 1,
            py: 2.5,
            pr: 2.5,
            height: 370,
          }}
        />
      )}
    </Card>
  );
}
