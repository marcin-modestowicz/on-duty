// @flow
import Shift from "./Shift";
import User from "./User";

describe("Shift model", () => {
  let user;
  let shift;

  beforeEach(() => {
    user = new User("Marty McFly");
    shift = new Shift([user]);
  });

  test("should set index on instance creation", () => {
    expect(shift.onDuty.slice()).toEqual([user]);
  });

  describe("method addUser", () => {
    test("should add user to the shift", () => {
      const anotherUser = new User("Homer Simpson");
      shift.addUser(anotherUser);
      expect(shift.onDuty.slice()).toEqual([user, anotherUser]);
    });
  });

  describe("method removeUser", () => {
    test("should remove user from the shift", () => {
      shift.removeUser(user.id);
      expect(shift.onDuty.slice()).toEqual([]);
    });
  });
});
