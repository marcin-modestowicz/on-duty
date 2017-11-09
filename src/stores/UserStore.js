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
        .once("value")
        .then(snapshot => this.getUserData(snapshot));

      firebase
        .database()
        .ref(`/availabilityCalendars/${userId}`)
        .on("value", snapshot => this.getAvailabilityCalendar(snapshot));
    }
  }

  @computed
  get isAdmin(): boolean {
    return !!this.user && this.user.isAdmin;
  }

  getUserData(snapshot: Object) {
    const user = snapshot.val();
    const availabilityCalendar = this.user
      ? this.user.availabilityCalendar.days.map(
          ({ availability }) => availability.status
        )
      : undefined;

    this.user = new User(
      snapshot.key,
      user.name,
      user.isDoctor,
      user.isSpecialist,
      availabilityCalendar,
      user.isAdmin
    );
  }

  getAvailabilityCalendar(snapshot: Object) {
    const availabilityCalendar = snapshot.val();

    if (!this.user) {
      this.user = new User(snapshot.key, "");
    }

    this.user.availabilityCalendar.days.forEach(day => {
      const timestamp = day.date.getTime();

      if (
        availabilityCalendar[timestamp] != null &&
        availabilityCalendar[timestamp] !== day.availability.status
      ) {
        day.availability.setStatus(availabilityCalendar[timestamp]);
      }
    });
  }

  setDayStatus = (date: Date, status: AvailabilityStatus) => {
    firebase
      .database()
      .ref()
      .update({
        [`/availabilityCalendars/${this.user.id}/${date.getTime()}`]: status
      });
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
      .ref(`/availabilityCalendars/${this.user.id}`)
      .set(availabilityCalendar);
  };
}

export default UserStore;
