import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  CircularProgress,
  Divider,
} from '@mui/material';
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

export default function Home() {
  const [data, setData] = useState<RoomingList[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

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

        {/* Results count */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Showing {filteredData.length} of {data.length} events
        </Typography>

        {/* Grouped by Event */}
        {groupedByEvent.map((group, groupIndex) => (
          <Box key={group.eventId} sx={{ mb: 6 }}>
            {/* Event Divider with Name */}
            <Box sx={{ position: 'relative', mb: 4 }}>
              <Divider
                sx={{
                  borderColor: EVENT_COLORS[groupIndex % EVENT_COLORS.length],
                  borderWidth: 2,
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  bgcolor: 'background.default',
                  px: 3,
                  py: 1,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: EVENT_COLORS[groupIndex % EVENT_COLORS.length],
                    textAlign: 'center',
                  }}
                >
                  {group.eventName}
                </Typography>
              </Box>
            </Box>

            {/* Card grid for this event */}
            <Grid container justifyContent="stretch" spacing={3}>
              {group.items.map((item) => (
                <Grid item size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={item.roomingListId}>
                  <RFPCard data={item} />
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}

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
}
