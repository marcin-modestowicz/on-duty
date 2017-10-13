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
      const notAllLimitsReached = users.some(
        user => this.getUserShifts(user.id).length < user.requiredShifts
      );
      const userShiftCountPerPower = Object.keys(POWER).map(powerKey =>
        users
          .filter(user => user.power === POWER[powerKey])
          .reduce((sum, user) => {
            if (this.getUserShifts(user.id)[index]) {
              return (sum += 1);
            }

            return sum;
          }, 0)
      );

      // Sort users in shift
      currentShift._onDuty = currentShift._onDuty.sort((userA, userB) => {
        const userAShifts = this.getUserShifts(userA.id);
        const userBShifts = this.getUserShifts(userB.id);
        const userAShiftCount = userAShifts.length;
        const userBShiftCount = userBShifts.length;
        const hasUserAMinimumRestDays = !(
          userAShifts.some(
            shiftIndex =>
              shiftIndex >= index - MINIMUM_REST_DAYS && shiftIndex < index
          ) ||
          userAShifts.some(
            shiftIndex =>
              shiftIndex <= index + MINIMUM_REST_DAYS && shiftIndex > index
          )
        );
        const hasUserBMinimumRestDays = !(
          userBShifts.some(
            shiftIndex =>
              shiftIndex >= index - MINIMUM_REST_DAYS && shiftIndex < index
          ) ||
          userBShifts.some(
            shiftIndex =>
              shiftIndex <= index + MINIMUM_REST_DAYS && shiftIndex > index
          )
        );
        const hasUserARequiredShiftsFilled =
          userAShiftCount === userA.requiredShifts;
        const hasUserBRequiredShiftsFilled =
          userBShiftCount === userB.requiredShifts;
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

        if (userAShiftCount > userBShiftCount && userA.power >= userB.power) {
          userASortValue += 1;
        }

        if (userBShiftCount > userAShiftCount && userB.power >= userA.power) {
          userBSortValue += 1;
        }

        return userASortValue - userBSortValue;
      });

      // Seal shift
      currentShift.seal();
    });

    // Create summary
    this.summary = this.createSummary(users);
  }

  createSummary(users: User[]) {
    const summary = users.reduce((allUsers, currentUser, index) => {
      const availabilityDays = currentUser.availabilityCalendar.days;
      const shiftDays = this.getUserShifts(currentUser.id);
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
        shifts: shiftDays.length,
        shiftsShare: `${shiftDays.length /
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
