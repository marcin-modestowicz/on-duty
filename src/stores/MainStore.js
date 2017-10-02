//@flow
import { observable } from "mobx";
import User, { type UserType } from "../models/User";
import { type ShiftCalendar } from "../models/Calendar";

class MainStore {
  @observable users: User[] = [];
  @observable calendar: ShiftCalendar;

  addUser = (name: string, type: UserType) => {
    this.users.push(new User(name, type));
  };
}

export default MainStore;
