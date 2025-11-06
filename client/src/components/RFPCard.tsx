import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Button,
  Box,
  Stack,
} from "@mui/material";
import { CalendarMonth, ChevronRight } from "@mui/icons-material";
import { RoomingList } from "@/../../shared/types";
import {
  getMonthAbbreviation,
  getDayOfMonth,
  formatDateRange,
} from "@/lib/dateUtils";

interface RFPCardProps {
  data: RoomingList;
}

export function RFPCard({ data }: RFPCardProps) {
  const bookingCount = data.bookings.length;

  // Get date range from first and last booking
  const sortedBookings = [...data.bookings].sort(
    (a, b) =>
      new Date(a.checkInDate).getTime() - new Date(b.checkInDate).getTime(),
  );
  const firstCheckIn = sortedBookings[0]?.checkInDate;
  const lastCheckOut = sortedBookings[sortedBookings.length - 1]?.checkOutDate;

  const month = getMonthAbbreviation(data.cutOffDate);
  const day = getDayOfMonth(data.cutOffDate);

  // Get event badge color based on event name
  const getEventBadgeColor = (eventName: string) => {
    if (eventName.toLowerCase().includes("rolling")) {
      return "info";
    }
    if (eventName.toLowerCase().includes("ultra")) {
      return "secondary";
    }
    return "primary";
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.2s",
        "&:hover": {
          boxShadow: 6,
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        {/* Header with RFP name and event badge */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: "2px",
            gap: 2,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              component="h3"
              sx={{ fontWeight: 700, fontSize: "1.125rem", mb: 0.5 }}
            >
              {data.rfpName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Agreement:{" "}
              <span style={{ fontWeight: 700 }}>{data.agreement_type}</span>
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 0.5,
            }}
          >
            {/* <Chip
              label={data.eventName}
              color={getEventBadgeColor(data.eventName)}
              size="small"
              sx={{ fontWeight: 600 }}
            /> */}
            {/* Date badge */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                bgcolor: "primary.50",
                borderRadius: "8px",
                paddingBottom: "2px",
                minWidth: 60,
                border: "1px solid",
                borderColor: "primary.200",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  bgcolor: "primary.100",
                  pt: "2px",
                  pb: "1px",
                  mb: "2px",
                }}
                width="100%"
              >
                <Typography
                  sx={{
                    color: "primary.main",
                    textAlign: "center",
                    fontWeight: 700,
                    fontSize: "0.7rem",
                    textTransform: "uppercase",
                  }}
                >
                  {month}
                </Typography>
              </Box>
              <Typography
                variant="h4"
                sx={{
                  color: "primary.main",
                  fontWeight: 800,
                  lineHeight: 1,
                  fontSize: "1.75rem",
                }}
              >
                {day}
              </Typography>
            </Box>
            <Box width="100%">
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ fontSize: "10px", textAlign: "center" }}
              >
                Cut-off Date
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Date range */}
        {firstCheckIn && lastCheckOut && (
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ mb: "2px" }}
          >
            <CalendarMonth sx={{ fontSize: 12, color: "text.secondary" }} />
            <Typography
              color="text.secondary"
              sx={{ fontSize: 12, color: "text.secondary" }}
            >
              {formatDateRange(firstCheckIn, lastCheckOut)}
            </Typography>
          </Stack>
        )}
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          variant="contained"
          fullWidth
          endIcon={<ChevronRight />}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            py: 0.75,
            bgcolor: "primary.main",
            "&:hover": {
              bgcolor: "primary.dark",
            },
          }}
        >
          View bookings ({bookingCount})
        </Button>
      </CardActions>
    </Card>
  );
}
