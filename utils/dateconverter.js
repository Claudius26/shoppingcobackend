function convertDateToISO(dateStr) {
  if (!dateStr) return null;
  const [day, month, year] = dateStr.split('/');
  if (!day || !month || !year) return null;
  return `${year}-${month.padStart(2,'0')}-${day.padStart(2,'0')}`;
}

module.exports = { convertDateToISO };