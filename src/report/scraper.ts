import * as R from "ramda";

import { Employee, ReportEmployee, Timesheet } from "../models";
import { getOvertime, getTimesheet } from "./calculator";

export default function report(
  employees: Employee[]
): ReportEmployee[] {
  const onlyEmployees: Employee[] = R.filter(n => n.employee, employees);
  const employeeNames: string[] = R.uniq(R.map(n => n.name, onlyEmployees));

  return R.map(n => getInformationByEmployee(n, onlyEmployees), employeeNames);
}

function getInformationByEmployee(
  firstName: string,
  employees: Employee[]
): ReportEmployee {
  const employee: Employee[] = R.filter(n => n.name === firstName, employees);
  const dates: string[] = R.uniq(R.map(n => n.date, employee));
  const timesheet: Timesheet[] = getTimesheets(employee, dates);

  return {
    employee: firstName,
    report: getOvertime(timesheet),
    timesheet
  };
}

function getTimesheets(
  employee: Employee[],
  dates: string[]
): Timesheet[] {
  return R.map(n => getTimesheet(n, employee), dates);
}
