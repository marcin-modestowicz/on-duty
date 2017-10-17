export function getDayName(date: Date): string {
  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  return weekDays[date.getDay()];
}

export function getNextMonthDays(): Date[] {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const lastDay = new Date(year, month + 1, 0).getDate();
  const days = [];

  for (let i = 1; i <= lastDay; i += 1) {
    days.push(new Date(year, month, i));
  }

  return days;
}
