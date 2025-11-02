/**
 * Formats a date string to display month abbreviation
 * @param dateString - ISO date string
 * @returns Month abbreviation (e.g., "SEP", "OCT")
 */
export function getMonthAbbreviation(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
}

/**
 * Gets the day of the month from a date string
 * @param dateString - ISO date string
 * @returns Day of month as number
 */
export function getDayOfMonth(dateString: string): number {
  const date = new Date(dateString);
  return date.getDate();
}

/**
 * Formats a date range for display
 * @param startDate - Start date string
 * @param endDate - End date string
 * @returns Formatted date range (e.g., "Sep 1 - Sep 5, 2025")
 */
export function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
  const startDay = start.getDate();
  const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
  const endDay = end.getDate();
  const year = end.getFullYear();
  
  if (start.getMonth() === end.getMonth()) {
    return `${startMonth} ${startDay} - ${endDay}, ${year}`;
  }
  
  return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
}
