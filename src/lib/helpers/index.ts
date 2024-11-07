export function parseTimestamp(timestamp) {
  // Convert the timestamp string to a Date object
  const date = new Date(timestamp);

  // Format the date and time components
  const formattedDate = date.toISOString().slice(0, 10); // "YYYY-MM-DD"
  const formattedTime = date.toISOString().slice(11, 19); // "HH:MM:SS"

  return [formattedDate, formattedTime]
}

