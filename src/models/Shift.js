// @flow
import { observable, action } from "mobx";
import type User from "./User";

export class Shift {
  @observable onDuty: User[];

  constructor(users: User[] = []) {
    this.onDuty = users;
  }

  @action
  addUser = (user: User) => {
    this.onDuty.push(user);
  };

  @action
  removeUser = (id: string) => {
    const index = this.onDuty.findIndex(user => user.id === id);
    this.onDuty.splice(index, 1);
  };
}

export default Shift;
