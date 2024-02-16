export function getKeyForDayMonthYear() {
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();
  return `${day}-${month}-${year}`;
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
