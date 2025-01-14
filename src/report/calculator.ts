import * as R from "ramda";

import { isWeekend } from "date-fns";
import { Employee, Report, Timesheet } from "../models";

export function getTimesheet(
  date: string,
  employees: Employee[]
): Timesheet {
  const reportByDay: Employee[] = R.filter(n => n.date === date, employees);

  return {
    date,
    hours: R.sum((R.map(n => n.hours, reportByDay))),
    isWeekend: isWeekend(date)
  };
}

export function getOvertime(
  timesheet: Timesheet[]
): Report {
  return {
    weekdays: getOvertimeByType(timesheet, false),
    weekends: getOvertimeByType(timesheet, true),
  };
}

function getOvertimeByType(
  timesheet: Timesheet[],
  isWeekend: boolean
): number {
  const hourListByDay: number[] = R.pipe<Timesheet[], Timesheet[], number[]>(
    R.filter<Timesheet>(n => n.isWeekend === isWeekend),
    R.map<Timesheet, number>(n => n.hours)
  )(timesheet);
  const totalDays: number = hourListByDay.length;
  const normalHours: number = isWeekend ? 0 : totalDays * 8;
  const totalHours: number = R.sum(hourListByDay);

  return R.sum(hourListByDay) - normalHours;
}
