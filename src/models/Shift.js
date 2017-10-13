// @flow
import { observable, action } from "mobx";
import type User from "./User";

export const USERS_PER_SHIFT = 2;

export class Shift {
  _onDuty: User[];
  isSealed: boolean = false;

  constructor(users: User[] = []) {
    this._onDuty = users;
  }

  @action
  addUser = (user: User) => {
    this._onDuty.push(user);
  };

  @action
  removeUser = (id: string) => {
    const index = this._onDuty.findIndex(user => user.id === id);
    this._onDuty.splice(index, 1);
  };

  seal() {
    this.isSealed = true;
  }

  unseal() {
    this.isSealed = false;
  }

  get onDuty(): User[] {
    if (this.isSealed) {
      return this._onDuty.slice(0, USERS_PER_SHIFT);
    } else {
      return this._onDuty;
    }
  }
}

export default Shift;
