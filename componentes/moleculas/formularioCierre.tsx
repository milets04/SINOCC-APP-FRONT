
const getTodayNormalized = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); 
  return today;
};

const parseISODate = (dateString: string): Date => {
  if (!dateString || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return getTodayNormalized(); 
  }
  const parts = dateString.split('-');
  return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
};