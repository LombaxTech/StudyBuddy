export function getKeyForDayMonthYear() {
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();
  return `${day}-${month}-${year}`;
}

export function formatDateToDayMonthYear(date: Date): string {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

export function getKeyForYesterday() {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 1); // Subtract 1 day to get yesterday's date
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();
  return `${day}-${month}-${year}`;
}

export function getSessionsLastSevenDays(sessions: any[]): any[] {
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7); // Get the date 7 days ago

  return sessions.filter((session) => {
    // Parse the session date string into day, month, and year
    const [day, month, year] = session.date.split("-").map(Number);

    // Create a new Date object using the parsed day, month, and year
    const sessionDate = new Date(year, month - 1, day); // Month needs to be 0-indexed

    // Check if the session date is within the last 7 days (including today)
    return sessionDate >= sevenDaysAgo && sessionDate <= today;
  });
}

export function getSessionsBetweenDates(
  sessions: any[],
  startDate: Date,
  endDate: Date
): any[] {
  // Ensure the start date is before the end date
  if (startDate > endDate) {
    throw new Error("Start date must be before end date.");
  }

  return sessions.filter((session) => {
    // Parse the session date string into day, month, and year
    const [day, month, year] = session.date.split("-").map(Number);

    // Create a new Date object using the parsed day, month, and year
    const sessionDate = new Date(year, month - 1, day); // Month needs to be 0-indexed

    // Check if the session date is within the specified date range
    return sessionDate >= startDate && sessionDate <= endDate;
  });
}

export function getSessionsThisMonth(sessions: any[]): any[] {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // Start of the current month
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0); // End of the current month

  return sessions.filter((session) => {
    // Parse the session date string into day, month, and year
    const [day, month, year] = session.date.split("-").map(Number);

    // Create a new Date object using the parsed day, month, and year
    const sessionDate = new Date(year, month - 1, day); // Month needs to be 0-indexed

    // Check if the session date is within the current month
    return sessionDate >= startOfMonth && sessionDate <= endOfMonth;
  });
}

export function getKeyForMonthYear() {
  const currentDate = new Date();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();
  return `${month}-${year}`;
}

export function removeDuplicates(arr: any) {
  return arr.filter((item: any, index: any) => arr.indexOf(item) === index);
}
