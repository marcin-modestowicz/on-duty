//@flow
import { observable, computed, action, runInAction } from "mobx";
import firebase from "../firebase";
import User from "../models/User";
import {
  ShiftsCalendar,
  AvailabilityCalendar,
  MINIMUM_REST_DAYS
} from "../models/Calendar";
import { AVAILABILITY_STATUSES } from "../models/Availability";
import Shift, { USERS_PER_SHIFT } from "../models/Shift";
import UserStore from "./UserStore";

class AdminStore {
  @observable users: UserStore[] = [];
  @observable calendar: ShiftsCalendar;

  constructor(centerId: string) {
    firebase
      .database()
      .ref(`/centers/${centerId}/users`)
      .on("value", snapshot => {
        const users = snapshot.val();

        if (users) {
          const usersIds = Object.keys(snapshot.val());

          runInAction("add users", () => {
            this.users = usersIds.map(userId => new UserStore(userId));
          });
        }
      });
  }

  @computed
  get isReady(): boolean {
    return this.users.length >= USERS_PER_SHIFT * (MINIMUM_REST_DAYS + 1);
  }

  @action
  checkEmailAvailability = (email: string): Promise<boolean> => {
    const sanitizedEmail = email.replace(/\./g, "%2E");

    return firebase
      .database()
      .ref(`/emailToUserId/${sanitizedEmail}`)
      .once("value")
      .then(userId => {
        return !userId.val();
      });
  };

  addUser = (
    name: string,
    email: string,
    isDoctor: boolean,
    isSpecialist: boolean
  ) => {
    const sanitizedEmail = email.replace(/\./g, "%2E");
    const user = {
      center: "spsk2", // @todo replace hardcoded center id value with something meaningful
      name,
      isDoctor,
      isSpecialist,
      isAdmin: false
    };
    const userId = firebase
      .database()
      .ref("users")
      .push().key;

    firebase
      .database()
      .ref()
      .update({
        [`/users/${userId}`]: user, // @todo replace hardcoded center id value with something meaningful
        [`/centers/spsk2/users/${userId}`]: true // @todo replace hardcoded center id value with something meaningful
      })
      .then(() => {
        firebase
          .database()
          .ref(`/emailToUserId/${sanitizedEmail}`)
          .set(userId);
      });
  };

  @action
  fillCalendar = () => {
    if (this.isReady) {
      this.calendar = new ShiftsCalendar();
      this.calendar.fillCalendar(this.users.map(({ user }) => user));
      this.setAllDaysStatus();
    }
  };

  setDayStatus = (date: Date, shift: Shift) => {
    const users = shift.onDuty.reduce((sum, current) => {
      sum[current.id] = true;

      return sum;
    }, {});

    firebase
      .database()
      .ref(`/centers/spsk2/shiftCalendar/${date.getTime()}`)
      .set(users);
  };

  setAllDaysStatus = () => {
    const shiftCalendar = this.calendar.days.reduce((sum, day) => {
      const users = day.shift.onDuty.reduce((sum, current) => {
        sum[current.id] = true;

        return sum;
      }, {});

      sum[day.date.getTime()] = users;

      return sum;
    }, {});

    firebase
      .database()
      .ref("/centers/spsk2/shiftCalendar")
      .set(shiftCalendar);
  };

  @computed
  get summary(): ?(Object[]) {
    if (!this.calendar) {
      return null;
    }

    const summary = this.users.map(({ user }) => {
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
}

export default AdminStore;
