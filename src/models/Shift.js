// @flow
import { observable, action } from "mobx";
import type User from "./User";

const USERS_PER_SHIFT = 2;

export class Shift {
  _onDuty: User[];
  sealed: boolean;

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
    this.sealed = true;
  }

  unseal() {
    this.sealed = false;
  }

  get isSealed(): boolean {
    return this.sealed;
  }

  get onDuty(): User[] {
    if (this.sealed) {
      return this._onDuty.slice(0, USERS_PER_SHIFT);
    } else {
      return this._onDuty;
    }
  }
}

export default Shift;
