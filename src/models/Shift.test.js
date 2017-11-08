// @flow
import Shift from "./Shift";
import User from "./User";

describe("Shift model", () => {
  let user;
  let shift;

  beforeEach(() => {
    user = new User("a0", "Marty McFly");
    shift = new Shift([user]);
  });

  test("should set index on instance creation", () => {
    expect(shift.onDuty.slice()).toEqual([user]);
  });

  describe("method addUser", () => {
    test("should add user to the shift if shift is not full", () => {
      const anotherUser = new User("a1", "Homer Simpson");
      shift.addUser(anotherUser);
      expect(shift.onDuty.slice()).toEqual([user, anotherUser]);
    });

    test("should not add user to the shift if shift is full", () => {
      const user1 = new User("a1", "Homer Simpson");
      const user2 = new User("a2", "Marge Simpson");
      const user3 = new User("a3", "Bart Simpson");

      shift = new Shift([user1, user2]);

      shift.addUser(user3);

      expect(shift.onDuty.slice()).toEqual([user1, user2]);
    });
  });

  describe("method removeUser", () => {
    test("should remove user from the shift", () => {
      shift.removeUser(user.id);
      expect(shift.onDuty.slice()).toEqual([]);
    });
  });

  describe("method fill", () => {
    test("should fill the shift up to the limit", () => {
      const user1 = new User("a1", "Homer Simpson");
      const user2 = new User("a2", "Marge Simpson");
      const user3 = new User("a3", "Bart Simpson");

      shift.fill([user1, user2, user3]);

      expect(shift.onDuty.slice()).toEqual([user, user1]);
    });
  });

  describe("method toggleUser", () => {
    let addUserSpy;
    let removeUserSpy;

    beforeEach(() => {
      addUserSpy = jest.spyOn(shift, "addUser");
      removeUserSpy = jest.spyOn(shift, "removeUser");
    });

    test("should call removeUser if user is present", () => {
      shift.toggleUser(user);

      expect(removeUserSpy).toHaveBeenCalled();
    });

    test("should call addUser if user is not present", () => {
      const anotherUser = new User("a1", "Homer Simpson");

      shift.toggleUser(anotherUser);

      expect(addUserSpy).toHaveBeenCalled();
    });
  });
});
