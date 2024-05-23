export function formatDate(date: Date): string {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return 'Invalid date';
  }
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };
  const formatter = new Intl.DateTimeFormat('en-US', options);
  const [{ value: day }, , { value: month }, , { value: year }] =
    formatter.formatToParts(date);
  return `${month}-${day}-${year}`;
}

export function formatDateType(dateString) {
  const dateParts = dateString.split('-');
  return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
}
