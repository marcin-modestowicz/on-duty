//@flow
import { observable, computed, action } from "mobx";
import User from "../models/User";
import {
  ShiftsCalendar,
  AvailabilityCalendar,
  MINIMUM_REST_DAYS
} from "../models/Calendar";
import { AVAILABILITY_STATUSES } from "../models/Availability";
import { USERS_PER_SHIFT } from "../models/Shift";

class AdminStore {
  @observable users: User[] = [];
  @observable calendar: ShiftsCalendar;

  constructor() {
    const savedState = localStorage.getItem("on-duty");
    if (savedState) {
      this.users = JSON.parse(savedState).map(
        user =>
          new User(
            user.name,
            user.isDoctor,
            user.isSpecialist,
            user.availabilityCalendar.days.map(
              ({ availability: { status } }) => status
            )
          )
      );
    }
  }

  @computed
  get isReady(): boolean {
    return this.users.length >= USERS_PER_SHIFT * (MINIMUM_REST_DAYS + 1);
  }

  @action
  addUser = (name: string, isDoctor: boolean, isSpecialist: boolean) => {
    this.users.push(new User(name, isDoctor, isSpecialist));
  };

  fillCalendar = () => {
    if (this.isReady) {
      this.calendar = new ShiftsCalendar();
      this.calendar.fillCalendar(this.users);
    }
  };

  @computed
  get summary(): ?(Object[]) {
    if (!this.calendar) {
      return null;
    }

    const summary = this.users.map(user => {
      const availabilityDays = user.availabilityCalendar.days;
      const shiftDays = this.calendar.getUserShifts(user.id);
      const highPreferenceDays = availabilityDays.reduce(
        (sum, { availability }, index) => {
          if (availability.status === AVAILABILITY_STATUSES.KEEN) {
            sum.push(index);
          }

          return sum;
        },
        []
      );
      const highPreference = highPreferenceDays.length;
      const highPreferenceFilled = highPreferenceDays.filter(index =>
        shiftDays.includes(index)
      ).length;
      const lowPreferenceDays = availabilityDays.reduce(
        (sum, { availability }, index) => {
          if (availability.status === AVAILABILITY_STATUSES.BUSY) {
            sum.push(index);
          }

          return sum;
        },
        []
      );
      const lowPreference = lowPreferenceDays.length;
      const lowPreferenceFilled = lowPreferenceDays.filter(index =>
        shiftDays.includes(index)
      ).length;
      const shiftsShare =
        shiftDays.length /
        (this.calendar.days.length * USERS_PER_SHIFT / this.users.length) *
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

  saveState = () => {
    localStorage.setItem("on-duty", JSON.stringify(this.users));
  };
}

export default AdminStore;
