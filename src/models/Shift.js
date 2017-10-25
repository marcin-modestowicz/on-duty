// @flow
import { observable, action, computed } from "mobx";
import type User from "./User";

export const USERS_PER_SHIFT = 2;

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

  toggleUser = (user: User) => {
    const hasUser = this.onDuty.some(({ id }) => id === user.id);

    if (hasUser) {
      this.removeUser(user.id);
    } else {
      this.addUser(user);
    }
  };

  fill = (users: User[]) => {
    const newUsersCount = USERS_PER_SHIFT - this.onDuty.length;
    const usersToAdd = users.slice(0, newUsersCount);

    for (let i = 0; i < usersToAdd.length; i += 1) {
      this.addUser(users[i]);
    }
  };

  @computed
  get isReady(): boolean {
    return this.onDuty.length === USERS_PER_SHIFT;
  }
}

export default Shift;
