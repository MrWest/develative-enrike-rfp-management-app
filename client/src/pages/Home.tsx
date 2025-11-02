import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  CircularProgress,
} from '@mui/material';
import { RoomingList } from '@/../../shared/types';
import { RFPCard } from '@/components/RFPCard';
import { SearchAndFilters } from '@/components/SearchAndFilters';
import { fetchRoomingLists } from '@/lib/api';

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
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="xl">
        {/* Page title */}
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 4 }}>
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

        {/* Card grid */}
        <Grid container spacing={3}>
          {filteredData.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.roomingListId}>
              <RFPCard data={item} />
            </Grid>
          ))}
        </Grid>

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
