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

  describe("method fill", () => {
    test("should fill the shift up to the limit", () => {
      const user1 = new User("Homer Simpson");
      const user2 = new User("Marge Simpson");
      const user3 = new User("Bart Simpson");

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

      expect(addUserSpy).not.toHaveBeenCalled();
      expect(removeUserSpy).toHaveBeenCalled();
    });

    test("should call addUser if user is not present", () => {
      const anotherUser = new User("Homer Simpson");

      shift.toggleUser(anotherUser);

      expect(addUserSpy).toHaveBeenCalled();
      expect(removeUserSpy).not.toHaveBeenCalled();
    });
  });
});
