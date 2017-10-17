//@flow
import { observable, computed, action } from "mobx";
import User from "../models/User";
import {
  ShiftsCalendar,
  AvailabilityCalendar,
  MINIMUM_REST_DAYS
} from "../models/Calendar";
import { USERS_PER_SHIFT } from "../models/Shift";

class MainStore {
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

  saveState = () => {
    localStorage.setItem("on-duty", JSON.stringify(this.users));
  };
}

export default MainStore;
