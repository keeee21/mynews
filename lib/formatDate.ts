export const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getUtcNow = (): Date => {
  const localNow = new Date();
  const utcNow = new Date(
    localNow.getTime() + localNow.getTimezoneOffset() * 60000
  );
  return utcNow;
};

export const getStartOfUtcDay = (date: Date): Date => {
  const startOfDay = new Date(date);
  startOfDay.setUTCHours(0, 0, 0, 0);
  return startOfDay;
};

export const getEndOfUtcDay = (date: Date): Date => {
  const endOfDay = new Date(date);
  endOfDay.setUTCHours(23, 59, 59, 999);
  return endOfDay;
};
