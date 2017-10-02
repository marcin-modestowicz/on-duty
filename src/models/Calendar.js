// @flow
import { observable, computed, action } from "mobx";
import type User from "./User";
import Availability, { AVAILABILITY_STATUSES } from "./Availability";
import Shift from "./Shift";

export function daysInCurrentMonth() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  return new Date(year, month, 0).getDate();
}

export class ShiftCalendar {
  days: Shift[] = [];

  constructor(shifts: User[][]) {
    const maxDay = daysInCurrentMonth();

    for (let day = 1; day <= maxDay; day += 1) {
      this.days.push(new Shift(shifts[day - 1]));
    }
  }
}

export class AvailabilityCalendar {
  days: Availability[] = [];

  constructor() {
    const maxDay = daysInCurrentMonth();

    for (let day = 1; day <= maxDay; day += 1) {
      this.days.push(new Availability());
    }
  }
}
