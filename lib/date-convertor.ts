export function convertDateFormat(inputDate: string): string {
  const parsedDate = new Date(inputDate);

  if (isNaN(parsedDate.getTime())) {
    return 'Invalid date';
  }

  const month: number = parsedDate.getMonth() + 1;
  const day: number = parsedDate.getDate();
  const year: number = parsedDate.getFullYear();
  const hours: number = parsedDate.getHours();
  const minutes: number = parsedDate.getMinutes();
  const ampm: string = hours >= 12 ? 'PM' : 'AM';

  const formattedHours: number = hours % 12 || 12;

  const formattedMonth: string = month < 10 ? `0${month}` : month.toString();
  const formattedDay: string = day < 10 ? `0${day}` : day.toString();
  const formattedHoursWithZero: string =
    formattedHours < 10 ? `0${formattedHours}` : formattedHours.toString();
  const formattedMinutesWithZero: string =
    minutes < 10 ? `0${minutes}` : minutes.toString();

  const formattedDate: string = `${formattedMonth}/${formattedDay}/${year
    .toString()
    .slice(-2)} ${formattedHoursWithZero}:${formattedMinutesWithZero} ${ampm}`;

  return formattedDate;
}
