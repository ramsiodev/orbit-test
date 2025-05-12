import type { CardProps } from '@mui/material/Card';
import type { TimelineItemProps } from '@mui/lab/TimelineItem';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { Divider } from '@mui/material';
import Timeline from '@mui/lab/Timeline';
import TimelineDot from '@mui/lab/TimelineDot';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';

import { fDateTime } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  sections: {
    id: string;
    title: string;
    items: {
      id: string;
      type: string;
      description: string;
      time: any;
    }[];
  }[];
};

export function AnalyticsOrderTimeline({ title, subheader, sections, sx, ...other }: Props) {
  const [fullScreen, setFullScreen] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const handleToggleFullScreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setFullScreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setFullScreen(false);
    }
  }, []);

  const MAX_VISIBLE_SECTIONS = 2;
  const hasMoreSections = sections.length > MAX_VISIBLE_SECTIONS;
  const visibleSections = showMore ? sections : sections.slice(0, MAX_VISIBLE_SECTIONS);

  return (
    <Card
      sx={[
        {
          position: fullScreen ? 'fixed' : 'relative',
          top: fullScreen ? 0 : 'auto',
          left: fullScreen ? 0 : 'auto',
          right: fullScreen ? 0 : 'auto',
          bottom: fullScreen ? 0 : 'auto',
          zIndex: fullScreen ? 1300 : 'auto',
          m: fullScreen ? 0 : 'auto',
          width: fullScreen ? '100vw' : 'auto',
          height: fullScreen ? '100vh' : 'auto',
          overflow: 'auto',
          background: fullScreen && 'rgba(28, 37, 46)',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <CardHeader
        title={title}
        subheader={subheader}
        action={
          <IconButton onClick={handleToggleFullScreen} color={fullScreen ? 'primary' : 'default'}>
            <Iconify
              icon={
                fullScreen
                  ? 'solar:quit-full-screen-square-outline'
                  : 'solar:full-screen-square-outline'
              }
            />
          </IconButton>
        }
      />

      <Box sx={{ pl: 5, pt: 3 }}>
        {visibleSections.map((section) => (
          <Box key={section?.id} sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 0 }}>
              {section.title}
            </Typography>
            <Timeline
              sx={{
                m: 0,
                p: 0,
                [`& .${timelineItemClasses.root}:before`]: { flex: 0, padding: 0 },
              }}
            >
              {section.items.map((item, index) => (
                <Item key={item.id} item={item} lastItem={index === section.items.length - 1} />
              ))}
            </Timeline>
            <Divider variant="middle" />
          </Box>
        ))}
      </Box>

      {hasMoreSections && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            pb: 2,
            mt: -1,
          }}
        >
          <IconButton onClick={() => setShowMore(!showMore)} disableRipple>
            <Iconify
              icon={showMore ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
            />
            <Typography variant="button" sx={{ ml: 1 }}>
              {showMore ? 'Ver menos' : 'Ver más'}
            </Typography>
          </IconButton>
        </Box>
      )}
    </Card>
  );
}

// ----------------------------------------------------------------------

type ItemProps = TimelineItemProps & {
  lastItem: boolean;
  item: {
    id: string;
    type: string;
    description: string;
    time: any;
  };
};

function Item({ item, lastItem, ...other }: ItemProps) {
  return (
    <TimelineItem {...other}>
      <TimelineSeparator>
        <TimelineDot
          color={
            (item.type === 'Alert' && 'error') ||
            (item.type === 'Warning' && 'warning') ||
            'success'
          }
        />
        {lastItem ? null : <TimelineConnector />}
      </TimelineSeparator>

      <TimelineContent>
        <Stack direction="row" spacing={1}>
          <Typography variant="subtitle2">
            {item.type === 'Alert' && 'Alerta'}
            {item.type === 'Warning' && 'Advertencia'}
          </Typography>

          <Box
            sx={{ padding: ' 0px 10px', background: 'rgba(145, 158, 171, 0.08)', borderRadius: 1 }}
          >
            <Typography variant="subtitle2">{item.description}</Typography>
          </Box>
        </Stack>

        <Typography variant="caption" sx={{ color: 'text.disabled' }}>
          {fDateTime(item.time)}
        </Typography>
      </TimelineContent>
    </TimelineItem>
  );
}
