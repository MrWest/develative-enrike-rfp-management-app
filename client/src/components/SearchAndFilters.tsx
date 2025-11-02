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
import { useState } from "react";

interface SearchAndFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedStatuses: string[];
  onStatusToggle: (status: string) => void;
  onClearFilters: () => void;
  availableStatuses: string[];
}

export function SearchAndFilters({
  searchQuery,
  onSearchChange,
  selectedStatuses,
  onStatusToggle,
  onClearFilters,
  availableStatuses,
}: SearchAndFiltersProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const hasActiveFilters =
    selectedStatuses.length > 0 || searchQuery.length > 0;

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ mb: 4 }}>
      {/* <Stack
        direction={{ sm: 'row' }}
        spacing={2}
        alignItems={{ xs: 'stretch', sm: 'center' }}
        justifyContent="space-between"
      > */}
      <Grid container justifyContent="space-between">
        <Grid item xs>
          <TextField
            fullWidth
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ background: "#eaeaea", padding:'2px' }}>
                  <Search />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => onSearchChange("")}
                    edge="end"
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
                borderRadius: '8px !important',
              },
            }}
            variant="outlined"
          />
        </Grid>
        <Grid item>
          <Stack direction="row" spacing={1} alignItems="center">
            {hasActiveFilters && (
              <Button
                variant="text"
                size="small"
                onClick={onClearFilters}
                sx={{ textTransform: "none" }}
              >
                Clear filters
              </Button>
            )}

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
              <Box sx={{ px: 2, py: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Filter by Status
                </Typography>
              </Box>
              {availableStatuses.map((status) => (
                <MenuItem
                  key={status}
                  onClick={() => onStatusToggle(status)}
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
        </Grid>
      </Grid>
    </Box>
  );
}
