// @flow
import firebase from "../firebase";
import User from "../models/User";
import UserStore from "./UserStore";

describe("UserStore store", () => {
  let userDataSnapshotMock;
  let availabilityCalendarSnapshotMock;
  let refSpy;
  let userStore;

  beforeAll(() => {
    userDataSnapshotMock = { val: () => "test value" };
    availabilityCalendarSnapshotMock = { val: () => ({}) };
    refSpy = jest.fn(() => ({
      once: () => Promise.resolve(userDataSnapshotMock),
      on: (param, callback) => {
        callback(availabilityCalendarSnapshotMock);
      }
    }));
    jest
      .spyOn(firebase, "database")
      .mockImplementation(() => ({ ref: refSpy }));
  });

  afterAll(() => {
    // $FlowFixMe - jest bug https://github.com/facebook/jest/issues/4436
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    userStore = new UserStore();
  });

  describe("on initialization", () => {
    describe("if no userId was passed", () => {
      test("should do nothing", () => {
        expect(refSpy).not.toHaveBeenCalled();
      });
    });

    describe("if userId was passed", () => {
      let getUserDataSpy;
      let getAvailabilityCalendarSpy;

      beforeEach(() => {
        getUserDataSpy = jest.spyOn(UserStore.prototype, "getUserData");
        getAvailabilityCalendarSpy = jest.spyOn(
          UserStore.prototype,
          "getAvailabilityCalendar"
        );
        userStore = new UserStore("a1");
      });

      test("should query firebase database to get user data", () => {
        expect(getUserDataSpy).toHaveBeenCalledWith(userDataSnapshotMock);
      });

      test("should query firebase database to get user availabilityCalendar", () => {
        expect(getAvailabilityCalendarSpy).toHaveBeenCalledWith(
          availabilityCalendarSnapshotMock
        );
      });
    });
  });

  describe("computed property isAdmin", () => {
    test("should return false if there's no user", () => {
      expect(userStore.isAdmin).toBeFalsy();
    });

    test("should return false if user has isAdmin property set to false", () => {
      userStore.user = new User("a1", "Jake Doe");

      expect(userStore.isAdmin).toBeFalsy();
    });

    test("should return true if user has isAdmin property set to true", () => {
      userStore.user = new User(
        "a1",
        "Jake Doe",
        false,
        false,
        undefined,
        true
      );

      expect(userStore.isAdmin).toBeTruthy();
    });
  });

  describe("getUserData method", () => {
    test("should create new user", () => {
      const userData = {
        name: "Jane Doe",
        isDoctor: true,
        isSpecialist: true,
        isAdmin: true
      };

      userStore.getUserData({
        key: "a1",
        val: () => userData
      });

      expect(userStore.user).toMatchObject(userData);
    });
  });
});
