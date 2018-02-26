import * as moment from 'moment';

export function dateParamToDate(param: string): moment.Moment {
  const [year, month, date] = param.split('-').map((i) => parseInt(i, 10));
  const momentDate = moment().startOf('day');

  return momentDate.year(year).month(month - 1).date(date);
}

export function nextDay(date: moment.Moment): string {
  const newDate = moment(date).add(1, 'day');

  return newDate.format('YYYY-MM-DD');
}

export function prevDay(date: moment.Moment): string {
  const newDate = moment(date).subtract(1, 'day');

  return newDate.format('YYYY-MM-DD');
}
