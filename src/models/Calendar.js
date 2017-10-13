// @flow
import { observable, computed, action } from "mobx";
import type User from "./User";
import Availability, { AVAILABILITY_STATUSES } from "./Availability";
import Shift, { USERS_PER_SHIFT } from "./Shift";
import { POWER } from "./User";

export const MINIMUM_REST_DAYS = 1;

export function daysInCurrentMonth() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  return new Date(year, month, 0).getDate();
}

export class ShiftsCalendar {
  @observable days: Shift[] = [];
  @observable summary: { [key: string]: string | number };

  constructor() {
    const maxDay = daysInCurrentMonth();

    for (let day = 1; day <= maxDay; day += 1) {
      this.days.push(new Shift());
    }
  }

  fillCalendar(users: User[]) {
    // Fill all slots in shift with users
    this.days.forEach((shift, index) => {
      users.forEach(user => {
        shift.addUser(user);
      });
    });

    // Create index array to iterate over, sort by preference
    const indexes = this.days
      .slice()
      .map((shift, index) => {
        return {
          index,
          preference: shift.onDuty.reduce(
            (sum, user) =>
              sum +
              (user.availabilityCalendar.days[index].status ===
              AVAILABILITY_STATUSES.KEEN
                ? user.power
                : 0),
            0
          )
        };
      })
      .sort((shiftA, shiftB) => {
        return shiftB.preference - shiftA.preference;
      })
      .map(shift => shift.index);

    // Iterate over shifts, sort users in shift
    indexes.forEach(index => {
      const currentShift = this.days[index];
      const previousShifts = this.days.slice(index - MINIMUM_REST_DAYS, index);
      const nextShifts = this.days.slice(
        index + 1,
        index + MINIMUM_REST_DAYS + 1
      );
      const notAllLimitsReached = users.some(
        user => user.shiftCalendar.shiftCount < user.requiredShifts
      );
      const userShiftCountPerPower = Object.keys(POWER).map(powerKey =>
        users
          .filter(user => user.power === POWER[powerKey])
          .reduce((sum, user) => {
            if (user.shiftCalendar.days[index]) {
              return (sum += 1);
            }

            return sum;
          }, 0)
      );

      // Sort users in shift
      currentShift._onDuty = currentShift._onDuty.sort((userA, userB) => {
        const hasUserAMinimumRestDays = !(
          previousShifts.some(
            shift =>
              shift.isSealed && shift.onDuty.some(user => user.id === userA.id)
          ) ||
          nextShifts.some(
            shift =>
              shift.isSealed && shift.onDuty.some(user => user.id === userA.id)
          )
        );
        const hasUserBMinimumRestDays = !(
          previousShifts.some(
            shift =>
              shift.isSealed && shift.onDuty.some(user => user.id === userB.id)
          ) ||
          nextShifts.some(
            shift =>
              shift.isSealed && shift.onDuty.some(user => user.id === userB.id)
          )
        );
        const hasUserARequiredShiftsFilled =
          userA.shiftCalendar.shiftCount === userA.requiredShifts;
        const hasUserBRequiredShiftsFilled =
          userB.shiftCalendar.shiftCount === userB.requiredShifts;
        const userAAvailabilityStatus =
          userA.availabilityCalendar.days[index].status;
        const userBAvailabilityStatus =
          userB.availabilityCalendar.days[index].status;

        let userASortValue = -userAAvailabilityStatus * userA.power;
        let userBSortValue = -userBAvailabilityStatus * userB.power;

        if (!hasUserAMinimumRestDays) {
          userASortValue += 20;
        }

        if (!hasUserBMinimumRestDays) {
          userBSortValue += 20;
        }

        if (hasUserARequiredShiftsFilled && notAllLimitsReached) {
          userASortValue += 1;
        }

        if (hasUserBRequiredShiftsFilled && notAllLimitsReached) {
          userBSortValue += 1;
        }

        if (
          userShiftCountPerPower[userA.power] >
          userShiftCountPerPower[userB.power]
        ) {
          userASortValue += 1;
        } else if (
          userShiftCountPerPower[userA.power] <
          userShiftCountPerPower[userB.power]
        ) {
          userBSortValue += 1;
        }

        if (
          userA.shiftCalendar.shiftCount > userB.shiftCalendar.shiftCount &&
          userA.power >= userB.power
        ) {
          userASortValue += 1;
        }

        if (
          userA.shiftCalendar.shiftCount > userB.shiftCalendar.shiftCount &&
          userA.power >= userB.power
        ) {
          userASortValue += 1;
        }

        if (
          userB.shiftCalendar.shiftCount > userA.shiftCalendar.shiftCount &&
          userB.power >= userA.power
        ) {
          userBSortValue += 1;
        }

        return userASortValue - userBSortValue;
      });

      // Seal shift, mark shift as set in chosen users shift calendars
      currentShift.seal();
      currentShift.onDuty.forEach(user => {
        user.shiftCalendar.addShift(index + 1);
      });
    });

    // Create summary
    this.summary = this.createSummary(users);
  }

  createSummary(users: User[]) {
    const summary = users.reduce((allUsers, currentUser, index) => {
      const availabilityDays = currentUser.availabilityCalendar.days;
      const shiftDays = currentUser.shiftCalendar.days;
      const highPreference = availabilityDays.reduce(
        (sum, day) =>
          day.status === AVAILABILITY_STATUSES.KEEN ? (sum += 1) : sum,
        0
      );
      const highPreferenceFilled = availabilityDays.reduce(
        (sum, day, index) =>
          day.status === AVAILABILITY_STATUSES.KEEN && shiftDays[index]
            ? (sum += 1)
            : sum,
        0
      );
      const lowPreference = availabilityDays.reduce(
        (sum, day) =>
          day.status === AVAILABILITY_STATUSES.BUSY ? (sum += 1) : sum,
        0
      );
      const lowPreferenceFilled = availabilityDays.reduce(
        (sum, day, index) =>
          day.status === AVAILABILITY_STATUSES.BUSY && shiftDays[index]
            ? (sum += 1)
            : sum,
        0
      );
      const satisfaction =
        (highPreferenceFilled === 0
          ? 0
          : highPreferenceFilled / highPreference) -
        (lowPreferenceFilled === 0 ? 0 : lowPreferenceFilled / lowPreference);

      allUsers[currentUser.id] = {
        id: currentUser.id,
        name: currentUser.name,
        power: currentUser.power,
        highPreference,
        highPreferenceFilled,
        lowPreference,
        lowPreferenceFilled,
        shifts: currentUser.shiftCalendar.shiftCount,
        shiftsShare: `${currentUser.shiftCalendar.shiftCount /
          (this.days.length * USERS_PER_SHIFT / users.length) *
          100}%`,
        satisfaction
      };

      return allUsers;
    }, {});

    return summary;
  }
}

export class AvailabilityCalendar {
  days: Availability[] = [];

  constructor(availability?: number[] = []) {
    const maxDay = availability.length
      ? availability.length
      : daysInCurrentMonth();

    for (let day = 1; day <= maxDay; day += 1) {
      // $FlowFixMe
      this.days.push(new Availability(availability[day - 1]));
    }
  }
}

export class ShiftCalendar {
  days: boolean[] = [];

  constructor(days: ?(boolean[])) {
    if (days) {
      this.days = days;
    } else {
      const maxDay = daysInCurrentMonth();

      for (let day = 1; day <= maxDay; day += 1) {
        this.days.push(false);
      }
    }
  }

  addShift(day: number) {
    this.days[day - 1] = true;
  }

  removeShift(day: number) {
    this.days[day - 1] = false;
  }

  get shiftCount(): number {
    return this.days.filter(shift => shift).length;
  }
}
