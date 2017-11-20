//@flow
import { observable, computed, runInAction } from "mobx";
import firebase from "../firebase";
import User from "../models/User";
import { AvailabilityCalendar } from "../models/Calendar";
import { type AvailabilityStatus } from "../models/Availability";

class UserStore {
  @observable user: User;

  constructor(userId: ?string) {
    if (userId) {
      firebase
        .database()
        .ref(`/users/${userId}`)
        .on("value", snapshot => this.getUserData(snapshot));
    }
  }

  @computed
  get isAdmin(): boolean {
    return !!this.user && this.user.isAdmin;
  }

  getUserData(snapshot: Object) {
    const user = snapshot.val();

    if (user) {
      if (!this.user) {
        this.user = new User(
          snapshot.key,
          user.name,
          user.isDoctor,
          user.isSpecialist,
          undefined,
          user.isAdmin
        );
      }

      if (user.availabilityCalendar) {
        this.user.availabilityCalendar.days.forEach(day => {
          const timestamp = day.date.getTime();

          if (
            user.availabilityCalendar[timestamp] != null &&
            user.availabilityCalendar[timestamp] !== day.availability.status
          ) {
            day.availability.setStatus(user.availabilityCalendar[timestamp]);
          }
        });
      }
    }
  }

  setDayStatus = (date: Date, status: AvailabilityStatus) => {
    firebase
      .database()
      .ref(`/users/${this.user.id}/availabilityCalendar/${date.getTime()}`)
      .set(status);
  };

  setAllDaysStatus = (
    calendar: AvailabilityCalendar,
    status: AvailabilityStatus
  ) => {
    const availabilityCalendar = calendar.days.reduce((sum, day) => {
      sum[day.date.getTime()] = status;
      return sum;
    }, {});

    firebase
      .database()
      .ref(`/users/${this.user.id}/availabilityCalendar`)
      .set(availabilityCalendar);
  };
}

export default UserStore;
