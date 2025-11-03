import {
  Box,
  TextField,
  Button,
  Stack,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Badge,
  Typography,
  Grid,
} from "@mui/material";
import { Search, FilterList, Close } from "@mui/icons-material";
import { useCallback, useEffect, useState } from "react";
import { XCircleIcon } from "lucide-react";
import { fetchStatuses } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import useQueryParams from "@/hooks/useQueryParams";
import _ from "lodash";

interface SearchAndFiltersProps {
  // searchQuery: string;
  // onSearchChange: (value: string) => void;
  // selectedStatuses: string[];
  // onStatusToggle: (status: string) => void;
  // onClearFilters: () => void;
  // availableStatuses: string[];
}

export function SearchAndFilters({}: SearchAndFiltersProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState<string | null>("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const hasActiveFilters =
    selectedStatuses.length > 0 || searchQuery?.length > 0;

  const query = useQueryParams();
  const search = query.get("search");

  const debouncedQuery = _.debounce((key, value) => {
    const url = new URL(window.location.href);
    url.searchParams.set(key, value);
    window.history.replaceState({}, "", url);
  }, 300);

  useEffect(() => {
    debouncedQuery("search", searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    debouncedQuery("statuses", selectedStatuses.join());
  }, [selectedStatuses]);

  useEffect(() => {
    setSearchQuery(search);
  }, [search]);

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const { data: availableStatuses } = useQuery({
    queryKey: ["rfp-statuses"],
    queryFn: () => fetchStatuses(),
    initialData: [],
  });

  // Toggle status filter
  const handleStatusToggle = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    // setSearchQuery("");
    // setDebouncedSearchQuery("");
    setSelectedStatuses([]);
  }, []);

  return (
    <Box sx={{ mb: { xs: 2, sm: 4 } }}>
      {/* <Stack
        direction={{ sm: 'row' }}
        spacing={2}
        alignItems={{ xs: 'stretch', sm: 'center' }}
        justifyContent="space-between"
      > */}
      <Grid container justifyContent="space-between">
        <Grid item>
          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment
                    position="start"
                    sx={{
                      background: "#eaeaea",
                      padding: "2px",
                      borderRadius: "4px",
                    }}
                  >
                    <Search />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setSearchQuery("")}
                      edge="end"
                      disabled={!searchQuery}
                      sx={{ visibility: searchQuery ? "visible" : "hidden" }}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                maxWidth: { sm: 400 },
                "& .MuiInputBase-input": {
                  padding: "8px 12px 8px 0px",
                },
                "& .MuiInputBase-root": {
                  borderRadius: "8px !important",
                  paddingLeft: "6px",
                },
              }}
              variant="outlined"
            />
            <Stack direction="row" spacing={1} alignItems="center">
              <Badge
                badgeContent={selectedStatuses.length}
                color="primary"
                invisible={selectedStatuses.length === 0}
              >
                <Button
                  variant="outlined"
                  startIcon={<FilterList />}
                  onClick={handleFilterClick}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    py: 0.75,
                  }}
                >
                  Filters
                </Button>
              </Badge>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleFilterClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                PaperProps={{
                  sx: { minWidth: 220, mt: 1 },
                }}
              >
                <Grid
                  container
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ px: 2, mb: 1 }}
                >
                  <Grid item>
                    <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                      Filter by Status
                    </Typography>
                  </Grid>
                  {hasActiveFilters && (
                    <Grid item>
                      <Button
                        variant="text"
                        size="small"
                        onClick={handleClearFilters}
                        sx={{
                          textTransform: "none",
                          fontSize: { xs: 10, sm: 12 },
                        }}
                      >
                        <XCircleIcon size={14} />
                        <span style={{ marginLeft: 4 }}>Clear</span>
                      </Button>
                    </Grid>
                  )}
                </Grid>
                {availableStatuses.map((status) => (
                  <MenuItem
                    key={status}
                    onClick={() => handleStatusToggle(status)}
                    dense
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedStatuses.includes(status)}
                          size="small"
                        />
                      }
                      label={status}
                      sx={{ width: "100%", m: 0 }}
                    />
                  </MenuItem>
                ))}
              </Menu>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
