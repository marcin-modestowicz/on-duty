//@flow
import { observable } from "mobx";
import User from "../models/User";
import { type ShiftCalendar } from "../models/Calendar";

class MainStore {
  @observable users: User[] = [];
  @observable calendar: ShiftCalendar;

  addUser = (name: string, isDoctor: boolean, isSpecialist: boolean) => {
    this.users.push(new User(name, isDoctor, isSpecialist));
  };
}

export default MainStore;
