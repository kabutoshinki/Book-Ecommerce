function formatDate(dateString) {
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };
  return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
}

function formatDateToISO(dateString) {
  const [day, month, year] = dateString.split('-');
  return `${year}-${month}-${day}`;
}
