import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  CircularProgress,
  Divider,
  IconButton,
  ButtonGroup,
  Button,
  Collapse,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  UnfoldMore as UnfoldMoreIcon,
  UnfoldLess as UnfoldLessIcon,
  ViewAgenda as ViewAgendaIcon,
} from '@mui/icons-material';
import { RoomingList } from '@/../../shared/types';
import { RFPCard } from '@/components/RFPCard';
import { SearchAndFilters } from '@/components/SearchAndFilters';
import { fetchRoomingLists } from '@/lib/api';

// Color palette for event dividers
const EVENT_COLORS = [
  '#2563eb', // Blue
  '#a855f7', // Purple
  '#06b6d4', // Cyan
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#ef4444', // Red
  '#8b5cf6', // Violet
  '#ec4899', // Pink
];

// Color gradients for event dividers (transparent → color → transparent)
const EVENT_COLOR_GRADIENTS = [
  'linear-gradient(to right, transparent, #2563eb, transparent)', // Blue
  'linear-gradient(to right, transparent, #a855f7, transparent)', // Purple
  'linear-gradient(to right, transparent, #06b6d4, transparent)', // Cyan
  'linear-gradient(to right, transparent, #f59e0b, transparent)', // Amber
  'linear-gradient(to right, transparent, #10b981, transparent)', // Emerald
  'linear-gradient(to right, transparent, #ef4444, transparent)', // Red
  'linear-gradient(to right, transparent, #8b5cf6, transparent)', // Violet
  'linear-gradient(to right, transparent, #ec4899, transparent)', // Pink
];

type CollapseState = 'expanded' | 'collapsed' | 'oneRow';

export default function Home() {
  const [data, setData] = useState<RoomingList[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  
  // Collapse state for each event group
  const [collapseStates, setCollapseStates] = useState<Record<string, CollapseState>>({});

  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const roomingLists = await fetchRoomingLists();
        setData(roomingLists);
      } catch (error) {
        console.error('Error loading RFP data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Get unique statuses from data
  const availableStatuses = useMemo(() => {
    const statuses = new Set(data.map((item) => item.status));
    return Array.from(statuses).sort();
  }, [data]);

  // Filter data based on search query and selected statuses
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Search filter (RFP name and agreement type)
      const matchesSearch =
        debouncedSearchQuery === '' ||
        item.rfpName.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        item.agreement_type.toLowerCase().includes(debouncedSearchQuery.toLowerCase());

      // Status filter
      const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(item.status);

      return matchesSearch && matchesStatus;
    });
  }, [data, debouncedSearchQuery, selectedStatuses]);

  // Group filtered data by eventId
  const groupedByEvent = useMemo(() => {
    const groups = new Map<string, { eventName: string; items: RoomingList[] }>();

    filteredData.forEach((item) => {
      const key = item.eventId;
      if (!groups.has(key)) {
        groups.set(key, {
          eventName: item.eventName,
          items: [],
        });
      }
      groups.get(key)!.items.push(item);
    });

    // Convert to array and sort by event name
    return Array.from(groups.entries())
      .map(([eventId, group]) => ({
        eventId,
        eventName: group.eventName,
        items: group.items,
      }))
      .sort((a, b) => a.eventName.localeCompare(b.eventName));
  }, [filteredData]);

  // Initialize collapse states for new groups
  useEffect(() => {
    const newStates: Record<string, CollapseState> = {};
    groupedByEvent.forEach((group) => {
      if (!(group.eventId in collapseStates)) {
        newStates[group.eventId] = 'expanded';
      }
    });
    if (Object.keys(newStates).length > 0) {
      setCollapseStates((prev) => ({ ...prev, ...newStates }));
    }
  }, [groupedByEvent, collapseStates]);

  // Toggle collapse state for a specific event
  const toggleCollapseState = (eventId: string) => {
    setCollapseStates((prev) => {
      const current = prev[eventId] || 'expanded';
      const next: CollapseState =
        current === 'expanded' ? 'oneRow' : current === 'oneRow' ? 'collapsed' : 'expanded';
      return { ...prev, [eventId]: next };
    });
  };

  // Set all groups to a specific state
  const setAllCollapseStates = (state: CollapseState) => {
    const newStates: Record<string, CollapseState> = {};
    groupedByEvent.forEach((group) => {
      newStates[group.eventId] = state;
    });
    setCollapseStates(newStates);
  };

  // Toggle status filter
  const handleStatusToggle = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    setSearchQuery('');
    setDebouncedSearchQuery('');
    setSelectedStatuses([]);
  }, []);

  // Calculate how many items to show based on collapse state
  const getVisibleItems = (items: RoomingList[], state: CollapseState) => {
    if (state === 'collapsed') return [];
    if (state === 'oneRow') {
      // Show first 4 items (one row on desktop)
      return items.slice(0, 4);
    }
    return items; // expanded
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress size={40} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pt: 2, pb: 4 }}>
      <Container maxWidth="xl">
        {/* Page title */}
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
          Rooming List Management: Events
        </Typography>

        {/* Search and filters */}
        <SearchAndFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedStatuses={selectedStatuses}
          onStatusToggle={handleStatusToggle}
          onClearFilters={handleClearFilters}
          availableStatuses={availableStatuses}
        />

        {/* Results count and global controls */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Showing {filteredData.length} of {data.length} events
          </Typography>

          {/* Global collapse controls */}
          <ButtonGroup size="small" variant="outlined">
            <Button
              startIcon={<UnfoldMoreIcon />}
              onClick={() => setAllCollapseStates('expanded')}
              sx={{ textTransform: 'none' }}
            >
              Expand All
            </Button>
            <Button
              startIcon={<ViewAgendaIcon />}
              onClick={() => setAllCollapseStates('oneRow')}
              sx={{ textTransform: 'none' }}
            >
              One Row
            </Button>
            <Button
              startIcon={<UnfoldLessIcon />}
              onClick={() => setAllCollapseStates('collapsed')}
              sx={{ textTransform: 'none' }}
            >
              Collapse All
            </Button>
          </ButtonGroup>
        </Box>

        {/* Grouped by Event */}
        {groupedByEvent.map((group, groupIndex) => {
          const state = collapseStates[group.eventId] || 'expanded';
          const visibleItems = getVisibleItems(group.items, state);
          const color = EVENT_COLORS[groupIndex % EVENT_COLORS.length];
          const gradient = EVENT_COLOR_GRADIENTS[groupIndex % EVENT_COLOR_GRADIENTS.length];

          return (
            <Box key={group.eventId} sx={{ mb: 6 }}>
              {/* Event Divider with Name and Toggle */}
              <Box sx={{ position: 'relative', mb: 4 }}>
                <Divider
                  sx={{
                    background: gradient,
                    height: 2,
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.default',
                    px: 2,
                    py: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color,
                      textAlign: 'center',
                    }}
                  >
                    {group.eventName}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => toggleCollapseState(group.eventId)}
                    sx={{
                      color,
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        bgcolor: `${color}15`,
                      },
                    }}
                  >
                    {state === 'expanded' ? (
                      <ExpandLessIcon />
                    ) : state === 'oneRow' ? (
                      <ViewAgendaIcon />
                    ) : (
                      <ExpandMoreIcon />
                    )}
                  </IconButton>
                  <Typography variant="caption" color="text.secondary">
                    ({group.items.length})
                  </Typography>
                </Box>
              </Box>

              {/* Card grid for this event with smooth animation */}
              <Collapse
                in={state !== 'collapsed'}
                timeout={500}
                unmountOnExit
              >
                <Grid
                  container
                  justifyContent="stretch"
                  spacing={3}
                  sx={{
                    transition: 'all 0.5s ease-in-out',
                  }}
                >
                  {visibleItems.map((item, index) => (
                    <Grid
                      item
                      size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                      key={item.roomingListId}
                      sx={{
                        transition: 'all 0.3s ease-in-out',
                        transitionDelay: `${index * 50}ms`,
                      }}
                    >
                      <RFPCard data={item} />
                    </Grid>
                  ))}
                </Grid>

                {/* Show "X more items" indicator for oneRow state */}
                {state === 'oneRow' && group.items.length > 4 && (
                  <Box
                    sx={{
                      mt: 2,
                      textAlign: 'center',
                      cursor: 'pointer',
                      '&:hover': {
                        opacity: 0.7,
                      },
                    }}
                    onClick={() => toggleCollapseState(group.eventId)}
                  >
                    <Typography variant="body2" color={color} sx={{ fontWeight: 600 }}>
                      + {group.items.length - 4} more items
                    </Typography>
                  </Box>
                )}
              </Collapse>
            </Box>
          );
        })}

        {/* Empty state */}
        {filteredData.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 12 }}>
            <Typography color="text.secondary">
              No events found matching your criteria.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};
