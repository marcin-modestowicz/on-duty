// @flow
import { observable, computed, action } from "mobx";
import type User from "./User";
import Availability, { AVAILABILITY_STATUSES } from "./Availability";
import Shift, { USERS_PER_SHIFT } from "./Shift";

export const MINIMUM_REST_DAYS = 1;

export function daysInCurrentMonth() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  return new Date(year, month, 0).getDate();
}

export class ShiftsCalendar {
  @observable days: Shift[] = [];
  @observable summary: Object[];

  constructor() {
    const maxDay = daysInCurrentMonth();

    for (let day = 1; day <= maxDay; day += 1) {
      this.days.push(new Shift());
    }
  }

  getUserShifts(userId: string): number[] {
    return this.days.reduce((sum, { isSealed, onDuty }, index) => {
      if (isSealed && onDuty.some(user => user.id === userId)) {
        sum.push(index);
      }
      return sum;
    }, []);
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
      const shiftsPerPower = users.reduce((sum, user) => {
        if (!sum[user.power]) {
          sum[user.power] = {
            users: 0,
            shifts: 0
          };
        }
        sum[user.power].users += 1;
        sum[user.power].shifts += this.getUserShifts(user.id).length;

        return sum;
      }, {});

      // Sort users in shift
      currentShift._onDuty = currentShift._onDuty.sort((userA, userB) => {
        const userASortValue = this.getUserSortValue(
          userA,
          index,
          shiftsPerPower
        );
        const userBSortValue = this.getUserSortValue(
          userB,
          index,
          shiftsPerPower
        );

        return userASortValue - userBSortValue;
      });

      // Seal shift
      currentShift.seal();
    });

    // Create summary
    this.summary = this.createSummary(users);
  }

  getUserSortValue(
    user: User,
    shiftIndex: number,
    shiftsPerPower: Object
  ): number {
    const userShifts = this.getUserShifts(user.id);
    const userShiftCount = userShifts.length;
    const hasUserMinimumRestDays = !(
      userShifts.some(
        index => shiftIndex >= index - MINIMUM_REST_DAYS && shiftIndex < index
      ) ||
      userShifts.some(
        index => shiftIndex <= index + MINIMUM_REST_DAYS && shiftIndex > index
      )
    );
    const userAvailabilityStatus =
      user.availabilityCalendar.days[shiftIndex].status;
    const averageShiftsPerUserPower =
      shiftsPerPower[user.power].shifts / shiftsPerPower[user.power].users;

    let userSortValue = -userAvailabilityStatus * (user.power + 1);

    if (!hasUserMinimumRestDays) {
      userSortValue += 20;
    }

    if (userShiftCount >= averageShiftsPerUserPower) {
      userSortValue += userShiftCount - averageShiftsPerUserPower;
    }

    return userSortValue;
  }

  createSummary(users: User[]): Object[] {
    const summary = users.map(user => {
      const availabilityDays = user.availabilityCalendar.days;
      const shiftDays = this.getUserShifts(user.id);
      const highPreferenceDays = availabilityDays.reduce((sum, day, index) => {
        if (day.status === AVAILABILITY_STATUSES.KEEN) {
          sum.push(index);
        }

        return sum;
      }, []);
      const highPreference = highPreferenceDays.length;
      const highPreferenceFilled = highPreferenceDays.filter(index =>
        shiftDays.includes(index)
      ).length;
      const lowPreferenceDays = availabilityDays.reduce((sum, day, index) => {
        if (day.status === AVAILABILITY_STATUSES.BUSY) {
          sum.push(index);
        }

        return sum;
      }, []);
      const lowPreference = lowPreferenceDays.length;
      const lowPreferenceFilled = lowPreferenceDays.filter(index =>
        shiftDays.includes(index)
      ).length;
      const shiftsShare =
        shiftDays.length /
        (this.days.length * USERS_PER_SHIFT / users.length) *
        100;
      const satisfaction =
        (highPreferenceFilled === 0
          ? 0
          : highPreferenceFilled / highPreference) -
        (lowPreferenceFilled === 0 ? 0 : lowPreferenceFilled / lowPreference);

      return {
        id: user.id,
        name: user.name,
        power: user.power,
        highPreference,
        highPreferenceFilled,
        lowPreference,
        lowPreferenceFilled,
        shifts: shiftDays.length,
        shiftsShare: `${Math.round(shiftsShare)}%`,
        satisfaction: parseFloat(satisfaction.toFixed(2))
      };
    });

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
